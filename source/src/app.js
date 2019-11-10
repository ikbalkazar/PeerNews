import React from 'react';

import Login from './login';
import NavigationBar from './NavigationBar';
import Feed from './Feed';
import Compose from './Compose';
import Focus from './Focus';
import { verifyProofOfWork, ROUTES, ROUTE_NAME, toList, verifySignatureAndDecode } from './util';
import * as Message from './message';
import { createSender } from './message';
import PeerManager from './PeerManager';

const TEST_MESSAGES = new Map([
  ["1", {senderId: 'Jon', type: "text", text: "Hello!", messageId: "1", timestamp: 0}],
  ["2", {senderId: 'Sartre', type: "text", text: "Every existing thing is born without reason, prolongs itself out of weakness, and dies by chance.", messageId: "2", timestamp: 1}],
  ["3", {senderId: 'Albert', type: "text", text: "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.", messageId: "3", timestamp: 2}],
  ["4", {senderId: 'Jon', type: "text", text: "Huh, what kind of an existential hole did I find myself in here?", messageId: "4", timestamp: 3}],
]);

export default class App extends React.Component {
  state = {
    sender: null,
    numPeers: 0,
    messages: new Map(),
    route: ROUTES.test,
    routeParams: null,
  };

  componentDidMount() {
    const sender = createSender('Adam');
    this.setState({ sender });
    this.peerManager = new PeerManager({
      sender,
      onMessage: this.messageReceived,
      onPeerConnected: (_) => {
        const { numPeers } = this.state;
        this.setState({ numPeers: numPeers + 1 });
      },
      onPeerDisconnected: (_) => {
        const { numPeers } = this.state;
        this.setState({ numPeers: numPeers - 1 });
      },
    });
  }

  messageReceived = message => {
    const { messages } = this.state;
    console.log(`Got ${message}`);
    const parsed = verifySignatureAndDecode(JSON.parse(message));
    if (!parsed) {
      console.log(`Could not verify signature, ignoring: ${message}`);
      return;
    }
    if (!verifyProofOfWork(parsed)) {
      console.log(`Could not verify proof of work, ignoring: ${message}`);
      return;
    }
    console.log(`Receved and accepted message ${message}`);
    switch (parsed.type) {
      case Message.type.TEXT:
      case Message.type.COMMENT:
        if (!messages.has(parsed.messageId)) {
          messages.set(parsed.messageId, {parsed, message});
          this.setState({ messages: new Map(messages) });
          this.peerManager.broadcast(message);
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
    console.log('rebroadcasting');
    const { messages } = this.state;
    for (const item of messages.values()) {
      const { message } = item;
      this.peerManager.broadcast(message);
    }
  };

  handleClickPage = (pageId) => {
    this.setState({ route: pageId });
  };

  postMessage = (text) => {
    const { sender } = this.state;
    this.messageReceived(JSON.stringify(Message.createText(sender, text)));
  };

  postComment = (messageId, text) => {
    const { sender } = this.state;
    this.messageReceived(JSON.stringify(Message.createComment(sender, messageId, text)));
  };

  navigate = (route, routeParams) => {
    this.setState({ route, routeParams });
  };

  getFeedMessages = (messages) => {
    const feedMessages = toList(messages.values())
      .map(({parsed}) => parsed)
      .filter(message => message.type === Message.type.TEXT);
    const comments = toList(messages.values())
      .map(({parsed}) => parsed)
      .filter(message => message.type === Message.type.COMMENT);
    const messageComments = new Map();
    for (const comment of comments) {
      const current = messageComments.get(comment.reMessageId) || [];
      messageComments.set(comment.reMessageId, [...current, comment]);
    }
    return feedMessages.map(message => ({
      ...message,
      comments: messageComments.get(message.messageId) || [],
    }));
  };

  renderPage = () => {
    const { route, routeParams, messages } = this.state;
    const feedMessages = this.getFeedMessages(messages);
    switch (route) {
      case ROUTES.login:
        return <Login/>;
      case ROUTES.feed:
        return <Feed messages={feedMessages} navigate={this.navigate}/>;
      case ROUTES.compose:
        return <Compose postMessage={this.postMessage}/>;
      case ROUTES.focus:
        const focusMessage = feedMessages.filter(message =>
          message.messageId === routeParams.messageId)[0];
        return (
          <Focus
            message={focusMessage}
            navigate={this.navigate}
            postComment={this.postComment}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { numPeers } = this.state;
    const page = this.renderPage();
    const pageIds = Object.keys(ROUTE_NAME);
    const pages = pageIds.map(id => ({id, name: ROUTE_NAME[id]}));
    return (
      <div>
        {`Peers #: ${numPeers}`}
        <NavigationBar
          pages={pages}
          onClickPage={this.handleClickPage}
        />
        {page}
      </div>
    );
  }
}
