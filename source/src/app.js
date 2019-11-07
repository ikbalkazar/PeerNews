import React from 'react';
import Peer from 'simple-peer';
import WebSocket from 'ws';

import Login from './login';
import NavigationBar from './NavigationBar';
import Feed from './Feed';
import Compose from './Compose';
import { generateId } from './util';
import * as Message from './message';

const ROUTES = {
  login: "1",
  feed: "3",
  compose: "4",
};

const ROUTE_NAME = {
  "1": 'Login',
  "3": 'Feed',
  "4": 'Compose',
};

const TEST_MESSAGES = {
  "1": {senderId: 'Jon', type: "text", text: "Hello!", messageId: "1", timestamp: 0},
  "2": {senderId: 'Sartre', type: "text", text: "Every existing thing is born without reason, prolongs itself out of weakness, and dies by chance.", messageId: "2", timestamp: 1},
  "3": {senderId: 'Albert', type: "text", text: "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.", messageId: "3", timestamp: 2},
  "4": {senderId: 'Jon', type: "text", text: "Huh, what kind of an existential hole did I find myself in here?", messageId: "4", timestamp: 3},
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
    const id = generateId(100000);
    this.setState({ id });
    const ws = new WebSocket('ws://localhost:4059');
    this.createPeer(ws);

    ws.on('open', () => {
      alert('ws connected');
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
    const { id, peers } = this.state;
    this.setState({
      peers: [...peers, peer]
    });
    // Ask for old messages from the first connected peer
    if (peers.length === 1) {
      this.broadcast(Message.createRebroadcast(id));
    }
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
    console.log(`Received message ${parsed.senderId} ${parsed.text}`);
    switch (parsed.type) {
      case Message.type.TEXT:
        if (!(parsed.messageId in messageCache)) {
          messageCache[parsed.messageId] = parsed;
          this.setState({ messageCache });
          this.broadcast(parsed);
        }
        break;
      case Message.type.REBROADCAST:
        this.rebroadcast();
        break;
      default:
        console.log(`unrecognized message type ${parsed.type}`);
    }
  };

  rebroadcast = () => {
    console.log('rebroadcasting')
    const { messageCache } = this.state;
    for (const message of Object.values(messageCache)) {
      this.broadcast(message);
    }
  };

  broadcast = message => {
    console.log(`broadcasting ${message.text} ${message.messageId} type:${message.type}`);
    const { peers } = this.state;
    for (let i = 0; i < peers.length; i += 1) {
      peers[i].send(JSON.stringify(message));
    }
  };

  handleClickPage = (pageId) => {
    this.setState({ route: pageId });
  };

  postMessage = (text) => {
    const { id } = this.state;
    this.broadcast(Message.createText(id, text));
  };

  renderPage = () => {
    const { route, messageCache } = this.state;
    switch (route) {
      case ROUTES.login:
        return <Login/>;
      case ROUTES.feed:
        return <Feed messages={messageCache}/>;
      case ROUTES.compose:
        return <Compose postMessage={this.postMessage}/>;
      default:
        return null;
    }
  };

  render() {
    const { peers } = this.state;
    const page = this.renderPage();
    const pageIds = Object.keys(ROUTE_NAME);
    const pages = pageIds.map(id => ({id, name: ROUTE_NAME[id]}));
    return (
      <div>
        {`Peers #: ${peers.length}`}
        <NavigationBar
          pages={pages}
          onClickPage={this.handleClickPage}
        />
        {page}
      </div>
    );
  }
}
