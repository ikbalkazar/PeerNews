// @flow
import React, { Component } from 'react';
import Peer from 'simple-peer';
import WebSocket from 'ws';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  componentDidMount() {
    const id = `${Math.floor(Math.random() * 100000)}`;
    let wsConnected = false;
    let initiatorSignal = null;
    const ws = new WebSocket('ws://0d5b3915.ngrok.io');
    const p = new Peer({ initiator: true, trickle: false });

    p.on('error', err => console.log('error', err));

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
      const msg = Math.random();
      console.log(`CONNECT initiator ${msg}`);
      p.send(`saas ${msg}`);
    });

    p.on('data', data => {
      console.log(`data: ${data}`);
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
          const msg = Math.random();
          console.log(`CONNECT passive ${msg}`);
          p2.send(`saas ${msg}`);
        });
        p2.on('data', () => {
          console.log(`data: ${data}`);
        });
      } else if (message.type === 'response') {
        p.signal(message.signal);
      }
    });
  }

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
