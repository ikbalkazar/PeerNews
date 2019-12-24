import Peer from 'simple-peer';
import WebSocket from 'ws';
import * as Message from './message';
import { encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

const log = (message) => {
  console.log(`[PeerManager] ${message}`);
};


export default class PeerManager {
  constructor({sender, onMessage, onPeerConnected, onPeerDisconnected, connectorUsage}) {
    this.sender = sender;
    this.peers = [];
    this.wsConnected = false;
    this.initiatorSignal = null;
    this.root = null;
    this.manualRoot = null;
    this.onPeerConnected = onPeerConnected;
    this.onPeerDisconnected = onPeerDisconnected;
    this.onMessage = onMessage;
    console.log( "==== " + connectorUsage );
    if (connectorUsage) {
      this.connect();
    }
  }

  initiateManually = (onSignal) => {
    const p = new Peer({ initiator: true, trickle: false });
    this.manualRoot = p;

    p.on('error', err => {
      log(err);
      p.destroy();
      this.removePeer(p);
    });

    p.on('signal', data => {
      log(`signal ${JSON.stringify(data)}`);
      onSignal(JSON.stringify(data));
    });

    p.on('connect', () => {
      this.addPeer(p);
      log(`CONNECT manual initiator`);
    });

    p.on('data', data => {
      this.onMessage(encodeUTF8(data));
    });
  };

  applyResponseManually = (signal) => {
    if (this.manualRoot) {
      log(`Applying manual response to ${this.manualRoot}`);
      this.manualRoot.signal(JSON.parse(signal));
    }
  };

  applyRequestManually = (signal, onSignal) => {
    const p2 = new Peer({ trickle: false });
    p2.signal(JSON.parse(signal));
    p2.on('signal', signal => {
      onSignal(JSON.stringify(signal));
    });
    p2.on('connect', () => {
      this.addPeer(p2);
      log(`CONNECT passive`);
    });
    p2.on('data', receivedData => {
      this.onMessage(encodeUTF8(receivedData));
    });
    p2.on('error', err => {
      log(err);
      p2.destroy();
      this.removePeer(p2);
    });
  };

  connect = () => {
    const ws = new WebSocket('ws://46.101.68.25:5000');
    this.createPeer(ws);

    ws.on('open', () => {
      this.wsConnected = true;
      console.log('Connected to connector.');
      ws.send(this.sender.id);

      if (this.initiatorSignal !== null) {
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: this.initiatorSignal
          })
        );
        this.initiatorSignal = null;
      }
    });

    ws.on('message', data => {
      console.log(data);
      const message = JSON.parse(data);
      if (message.type === 'request') {
        const p2 = new Peer({ trickle: false });
        p2.signal(message.signal);
        p2.on('signal', signal => {
          ws.send(
            JSON.stringify({
              type: 'response',
              signal: JSON.stringify(signal),
              destination: message.destination
            })
          );
        });
        p2.on('connect', () => {
          this.addPeer(p2);
          log(`CONNECT passive`);
        });
        p2.on('data', receivedData => {
          this.onMessage(encodeUTF8(receivedData));
        });
        p2.on('error', err => {
          log(err);
          p2.destroy();
          this.removePeer(p2);
        });
      } else if (message.type === 'response') {
        log(`Response ${this.root}`);
        this.root.signal(message.signal);
      }
    });
  };

  createPeer = ws => {
    const p = new Peer({ initiator: true, trickle: false });
    this.root = p;

    p.on('error', err => {
      log(err);
      if (this.wsConnected) {
        p.destroy();
        this.removePeer(p);
        log('Reconnecting...');
        this.createPeer(ws);
      }
    });

    p.on('signal', data => {
      log(`signal ${JSON.stringify(data)}`);
      this.initiatorSignal = JSON.stringify(data);
      if (this.wsConnected && this.initiatorSignal) {
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: this.initiatorSignal
          })
        );
        this.initiatorSignal = null;
      }
    });

    p.on('connect', () => {
      this.addPeer(p);
      log(`CONNECT initiator`);
    });

    p.on('data', data => {
      this.onMessage(encodeUTF8(data));
    });
  };

  addPeer = peer => {
    this.peers.push(peer);
    // Ask for old messages from the first connected peer
    if (this.peers.length === 1) {
      this.broadcast(JSON.stringify(Message.createRebroadcast(this.sender)));
    }
    this.onPeerConnected(peer);
  };

  removePeer = peer => {
    this.peers = this.peers.filter(p => p !== peer);
    this.onPeerDisconnected(peer);
  };

  broadcast = message => {
    log(`broadcasting ${message}`);
    for (let i = 0; i < this.peers.length; i += 1) {
      this.peers[i].send(decodeUTF8(message));
    }
  };
}