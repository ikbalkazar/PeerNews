import Peer from 'simple-peer';
import WebSocket from 'ws';
import * as Message from './message';

const log = (message) => {
  console.log(`[PeerManager] ${message}`);
};


export default class PeerManager {
  constructor({sender, onMessage, onPeerConnected, onPeerDisconnected}) {
    this.sender = sender;
    this.peers = [];
    this.wsConnected = false;
    this.initiatorSignal = null;
    this.root = null;
    this.onPeerConnected = onPeerConnected;
    this.onPeerDisconnected = onPeerDisconnected;
    this.onMessage = onMessage;
    this.connect();
  }

  connect = () => {
    const ws = new WebSocket('ws://localhost:4059');
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
          this.onMessage(receivedData);
        });
        p2.on('error', err => {
          log(err);
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
      this.onMessage(data);
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
      this.peers[i].send(message);
    }
  };
}