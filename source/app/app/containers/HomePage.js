// @flow
import React, { Component } from 'react';
import Peer from 'simple-peer';
import WebSocket from 'ws';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  state = {
    id: null,
    peers: [],
    messageCache: {}
  };

  componentDidMount() {
    const id = `${Math.floor(Math.random() * 100000)}`;
    this.setState({ id });
    let wsConnected = false;
    let initiatorSignal = null;
    const ws = new WebSocket('ws://0d5b3915.ngrok.io');
    const p = new Peer({ initiator: true, trickle: false });

    p.on('error', err => {
      console.log(err);
      if (wsConnected) {
        console.log('Reconnecting...');
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: initiatorSignal
          })
        );
      }
      // TODO: delayed retry.
    });

    p.on('signal', data => {
      console.log(`signal ${JSON.stringify(data)}`);
      initiatorSignal = JSON.stringify(data);
      if (wsConnected) {
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: initiatorSignal
          })
        );
        initiatorSignal = null;
      }
    });

    p.on('connect', () => {
      this.addPeer(p);
      console.log(`CONNECT initiator`);
    });

    p.on('data', data => {
      this.messageReceived(data);
    });

    ws.on('open', () => {
      wsConnected = true;
      console.log('Connected to connector.');
      ws.send(id);

      if (initiatorSignal !== null) {
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: initiatorSignal
          })
        );
        initiatorSignal = null;
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
          console.log(`CONNECT passive`);
        });
        p2.on('data', receivedData => {
          this.messageReceived(receivedData);
        });
        p2.on('error', err => {
          console.log(err);
          this.removePeer(p2);
        });
      } else if (message.type === 'response') {
        p.signal(message.signal);
      }
    });

    document.querySelector('form').addEventListener('submit', ev => {
      ev.preventDefault();
      const message = this.createMessage(
        document.querySelector('#incoming').value
      );
      this.broadcast(message);
    });
  }

  addPeer = peer => {
    const { peers } = this.state;
    this.setState({
      peers: [...peers, peer]
    });
  };

  removePeer = peer => {
    const { peers } = this.state;
    this.setState({
      peers: peers.filter(p => p !== peer)
    });
  };

  messageReceived = message => {
    const { messageCache } = this.state;
    const parsed = JSON.parse(message);
    console.log(`Received message ${parsed.from} ${parsed.text}`);
    if (!(parsed.messageId in messageCache)) {
      messageCache[parsed.messageId] = message;
      this.setState({ messageCache });
      document.querySelector('#outgoing').textContent += message;
      document.querySelector('#outgoing').textContent += '\n';
      this.broadcast(message);
    }
  };

  createMessage = text => {
    const { id } = this.state;
    const messageId = `${Math.floor(Math.random() * 10000000)}`;
    return JSON.stringify({
      from: id,
      messageId,
      text
    });
  };

  broadcast = message => {
    const { peers } = this.state;
    for (let i = 0; i < peers.length; i += 1) {
      peers[i].send(message);
    }
  };

  render() {
    return (
      <div>
        <form>
          <textarea id="incoming" />
          <button type="submit">submit</button>
        </form>
        <pre id="outgoing" />
      </div>
    );
  }
}
