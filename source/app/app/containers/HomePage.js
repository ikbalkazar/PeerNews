// @flow
import React, { Component } from 'react';
import Peer from 'simple-peer';
import Wrtc from 'wrtc';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  componentDidMount() {
    const p = new Peer({ initiator: true, wrtc: Wrtc });

    p.on('error', err => console.log('error', err));

    p.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data));
      document.querySelector('#outgoing').textContent = JSON.stringify(data);
    });

    document.querySelector('form').addEventListener('submit', ev => {
      ev.preventDefault();
      p.signal(JSON.parse(document.querySelector('#incoming').value));
    });

    p.on('connect', () => {
      console.log('CONNECT');
      p.send(`whatever ${Math.random()}`);
    });

    p.on('data', data => {
      console.log(`data: ${data}`);
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
