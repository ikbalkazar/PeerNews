import React from 'react';

import NavigationBar from './NavigationBar';
import Feed from './Feed';
import GlobalPage from './GlobalPage';
import Compose from './Compose';
import Focus from './Focus';
import { ROUTES, ROUTE_NAME } from './util';
import PeerManager from './PeerManager';
import MessageManager from './MessageManager';
import PostMessage from './PostMessage';
import TorrentManager from './TorrentManager';

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
      followedTopics: [
          {label: "children", value: false},
          {label: "comics", value: false},
          {label: "commerce", value: false},
          {label: "crypto currency", value: false},
          {label: "culture", value: false},
          {label: "food", value: false},
          {label: "football", value: false},
          {label: "game", value: false},
          {label: "movies", value: false},
          {label: "travel", value: false}
        ],
      markedTopics: [
          {label: "children", value: false},
          {label: "comics", value: false},
          {label: "commerce", value: false},
          {label: "crypto currency", value: false},
          {label: "culture", value: false},
          {label: "food", value: false},
          {label: "football", value: false},
          {label: "game", value: false},
          {label: "movies", value: false},
          {label: "travel", value: false}
        ],
      route: ROUTES.feed,
      routeParams: null,
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
      onChangeFollowedTopics: (followedTopics) => {
        this.setState({ topics: followedTopics });
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
    this.setState({ route: pageId, routeParams:{} });
  };

  navigate = (route, routeParams) => {
    this.setState({ route, routeParams });
  };

  renderPage = () => {
    const { route, routeParams, markedTopics, followedTopics } = this.state;
    switch (route) {
      case ROUTES.feed:
        if( routeParams === null || typeof routeParams.filter === "undefined"  ){
          const feedMessages = this.messageManager.getFeedMessages( this.state.followedTopics );
          return (
            <Feed 
              followedTopics={this.state.followedTopics}
              messages={feedMessages} 
              getGlobalMessagesFilteredByTopics = {this.messageManager.getGlobalMessagesFilteredByTopics}
              navigate={this.navigate}
              upvote={this.messageManager.upvote}
              downvote={this.messageManager.downvote}
            />
          );
        }
        else{
          const feedMessages = this.messageManager.getGlobalMessagesFilteredByTopics( routeParams.filter );
          return (
            <Feed 
              followedTopics={routeParams.filter}
              messages={globalMessages} 
              getGlobalMessagesFilteredByTopics = {this.messageManager.getGlobalMessagesFilteredByTopics}
              navigate={this.navigate}
              upvote={this.messageManager.upvote}
              downvote={this.messageManager.downvote}
            />
          );
        }
      case ROUTES.focus:
        const focusMessage = feedMessages.filter(message =>
          message.messageId === routeParams.messageId)[0];
          if( typeof routeParams.filter === "undefined" ){
            return (
              <Focus
                message={focusMessage}
                backTrace={routeParams.backTrace}
                navigate={this.navigate}
                postComment={this.messageManager.postComment}
                upvote={this.messageManager.upvote}
                downvote={this.messageManager.downvote}
              />
            );
          }
          else
           return (
            <Focus
              message={focusMessage}
              filter={routeParams.filter}
              backTrace={routeParams.backTrace}
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
      case ROUTES.globalPage:
        if( routeParams === null || typeof routeParams.filter === "undefined"  ){
          const globalMessages = this.messageManager.getGlobalMessagesFilteredByTopics( this.state.markedTopics );
          return (
            <GlobalPage 
              markedTopics={this.state.markedTopics}
              messages={globalMessages} 
              getGlobalMessagesFilteredByTopics = {this.messageManager.getGlobalMessagesFilteredByTopics}
              navigate={this.navigate}
              upvote={this.messageManager.upvote}
              downvote={this.messageManager.downvote}
            />
          );
        }
        else{
          const globalMessages = this.messageManager.getGlobalMessagesFilteredByTopics( routeParams.filter );
          return (
            <GlobalPage 
              markedTopics={routeParams.filter}
              messages={globalMessages} 
              getGlobalMessagesFilteredByTopics = {this.messageManager.getGlobalMessagesFilteredByTopics}
              navigate={this.navigate}
              upvote={this.messageManager.upvote}
              downvote={this.messageManager.downvote}
            />
          );
        }
      
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
