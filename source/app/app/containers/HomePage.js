// @flow
import React, { Component } from 'react';
import Peer from 'simple-peer';
import WebSocket from 'ws';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  componentDidMount() {
    const id = `${Math.floor(Math.random() * 100000)}`;
    const ws = new WebSocket('ws://0d5b3915.ngrok.io');
    const p = new Peer({ initiator: true, trickle: false });

    ws.on('open', () => {
      console.log('Connected to connector.');
      ws.send(id);

      p.on('error', err => console.log('error', err));

      p.on('signal', data => {
        console.log(`signal ${JSON.stringify(data)}`);
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: JSON.stringify(data)
          })
        );
      });

      p.on('connect', () => {
        const msg = Math.random();
        console.log(`CONNECT passive ${msg}`);
        p.send(`saas ${msg}`);
      });

      p.on('data', data => {
        console.log(`data: ${data}`);
      });
    });

    ws.on('message', data => {
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
