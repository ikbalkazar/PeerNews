import React from 'react';
import Peer from 'simple-peer';
import WebSocket from 'ws';

import Login from './login';
import NavigationBar from './NavigationBar';
import Feed from './Feed';

const ROUTES = {
  login: "1",
  test: "2",
  feed: "3",
};

const ROUTE_NAME = {
  "1": 'Login',
  "2": 'Test',
  "3": 'Feed',
};

const TEST_MESSAGES = {
  "1": {from: 'Jon', text: "Hello!", messageId: "1"},
  "2": {from: 'Satre', text: "Every existing thing is born without reason, prolongs itself out of weakness, and dies by chance.", messageId: "2"},
  "3": {from: 'Albert', text: "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.", messageId: "3"},
  "4": {from: 'Jon', text: "Huh, what kind of an existential hole did I find myself in here?", messageId: "4"},
};

export default class App extends React.Component {
  state = {
    id: null,
    peers: [],
    messageCache: TEST_MESSAGES,
    wsConnected: false,
    initiatorSignal: null,
    root: null,
    route: ROUTES.test,
  };

  componentDidMount() {
    alert('loaded');
    const id = `${Math.floor(Math.random() * 100000)}`;
    this.setState({ id });
    const ws = new WebSocket('ws://0d5b3915.ngrok.io');
    this.createPeer(ws);

    ws.on('open', () => {
      const { initiatorSignal } = this.state;
      this.setState({ wsConnected: true });
      console.log('Connected to connector.');
      ws.send(id);

      if (initiatorSignal !== null) {
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: initiatorSignal
          })
        );
        this.setState({
          initiatorSignal: null
        });
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
        const { root } = this.state;
        console.log(`Response ${root}`);
        root.signal(message.signal);
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

  createPeer = ws => {
    const p = new Peer({ initiator: true, trickle: false });
    this.setState({ root: p });

    p.on('error', err => {
      const { wsConnected } = this.state;
      console.log(err);
      if (wsConnected) {
        p.destroy();
        this.removePeer(p);
        console.log('Reconnecting...');
        this.createPeer(ws);
      }
    });

    p.on('signal', data => {
      const { wsConnected } = this.state;
      console.log(`signal ${JSON.stringify(data)}`);
      const initiatorSignal = JSON.stringify(data);
      this.setState({ initiatorSignal });
      if (wsConnected && initiatorSignal) {
        ws.send(
          JSON.stringify({
            type: 'request',
            signal: initiatorSignal
          })
        );
        this.setState({
          initiatorSignal: null
        });
      }
    });

    p.on('connect', () => {
      this.addPeer(p);
      console.log(`CONNECT initiator`);
    });

    p.on('data', data => {
      this.messageReceived(data);
    });
  };

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

  renderTest = () => {
    return (
      <div>
        <h1>Title</h1>
        <form>
          <textarea id="incoming" />
          <button type="submit">submit</button>
        </form>
        <pre id="outgoing" />
      </div>
    );
  };

  handleClickPage = (pageId) => {
    this.setState({ route: pageId });
  };

  postMessage = (text) => {
    this.broadcast(this.createMessage(text));
  };

  renderPage = () => {
    const { route, messageCache } = this.state;
    switch (route) {
      case ROUTES.login:
        return <Login/>;
      case ROUTES.test:
        return this.renderTest();
      case ROUTES.feed:
        return (
          <Feed
            messages={messageCache}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const page = this.renderPage();
    const pageIds = Object.keys(ROUTE_NAME);
    const pages = pageIds.map(id => ({id, name: ROUTE_NAME[id]}));
    return (
      <div>
        <NavigationBar
          pages={pages}
          onClickPage={this.handleClickPage}
        />
        {page}
      </div>
    );
  }
}
