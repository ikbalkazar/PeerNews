import React from 'react';

import NavigationBar from './NavigationBar';
import Feed from './Feed';
import Compose from './Compose';
import Focus from './Focus';
import { ROUTES, ROUTE_NAME } from './util';
import PeerManager from './PeerManager';
import MessageManager from './MessageManager';
import PostMessage from './PostMessage';
import TorrentManager from './TorrentManager';
import TopicPage from './TopicPage';
import Topics from './Topics';

const TEST_MESSAGES = new Map([
  ["1", {senderId: 'Jon', type: "text", text: "Hello!", messageId: "1", timestamp: 0}],
  ["2", {senderId: 'Sartre', type: "text", text: "Every existing thing is born without reason, prolongs itself out of weakness, and dies by chance.", messageId: "2", timestamp: 1}],
  ["3", {senderId: 'Albert', type: "text", text: "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.", messageId: "3", timestamp: 2}],
  ["4", {senderId: 'Jon', type: "text", text: "Huh, what kind of an existential hole did I find myself in here?", messageId: "4", timestamp: 3}],
]);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPeers: 0,
      messages: new Map(),
      route: ROUTES.feed,
      routeParams: null,
      topics: [
        {label: "children", value: true, valuestring: "Followed", color: "GREEN", marginLeft: "37%"},
        {label: "comics", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "39%"},
        {label: "commerce", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "37%"},
        {label: "crypto currency", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "31%"},
        {label: "culture", value: false, valueString: "Unfollowed", color : "RED", marginLeft: "38%"},
        {label: "food", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "41%"},
        {label: "football", value: true, valuestring: "Followed", color: "GREEN", marginLeft: "37%"},
        {label: "game", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "41%"},
        {label: "movies", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "39%"},
        {label: "travel", value: false, valueString: "Unfollowed", color: "RED", marginLeft: "39%"}
      ],
    };
    const { sender } = props;
    this.torrentManager = new TorrentManager();
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
    this.messageManager = new MessageManager({
      sender,
      peerManager: this.peerManager,
      torrentManager: this.torrentManager,
      onChange: (messages) => {
        this.setState({ messages: new Map(messages) });
      },
    });
  }

  messageReceived = (message) => {
    if (!this.messageManager) {
      console.log('no message manager found');
      return;
    }
    this.messageManager.messageReceived(message);
  };

  handleClickPage = (pageId) => {
    this.setState({ route: pageId });
  };

  navigate = (route, routeParams) => {
    this.setState({ route, routeParams });
  };

  handleChangeTopic = ( label, value ) => {
    const index = this.state.topics.findIndex((topic)=> {
        return (topic.label === label);
    })

    const topic = Object.assign({}, this.state.topics[index]);

    topic.value = value;
    if( value === true )
      topic.color = "GREEN";
    else
      topic.color = "RED";

    const newTopics = Object.assign([], this.state.topics);
    newTopics[index] = topic;

    this.setState({topics:newTopics});
  };

  renderPage = () => {
    const { route, routeParams } = this.state;
    const feedMessages = this.messageManager.getFeedMessages();
    switch (route) {
      case ROUTES.feed:
        return (
          <Feed
            messages={feedMessages}
            navigate={this.navigate}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
          />
        );
      case ROUTES.focus:
        const focusMessage = feedMessages.filter(message =>
          message.messageId === routeParams.messageId)[0];
        return (
          <Focus
            message={focusMessage}
            navigate={this.navigate}
            postComment={this.messageManager.postComment}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
          />
        );
      case ROUTES.postMessage:
        return (
          <PostMessage
            postMessage={this.messageManager.postMessage}
            seedAsTorrent={this.torrentManager.seed}
          />
        );
      case ROUTES.TopicPage:
        const filteredMessages = this.messageManager.getFilteredMessagesByTopic(routeParams.topic);
        return (
          <TopicPage
            messages={filteredMessages}
            navigate={this.navigate}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
            handleChangeTopic = {this.handleChangeTopic}
          />
        );
      case ROUTES.topics:
        return (
          <Topics
            navigate={this.navigate}
            topicsList={this.state.topics}
            handleChangeTopic={this.handleChangeTopic}
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
          onLogout={this.props.onLogout}
        />
        {page}
      </div>
    );
  }
}
