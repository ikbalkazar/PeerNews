import React from 'react';
import NavigationBar from './NavigationBar';
import Feed from './Feed';
import Profile from './Profile';
import Compose from './Compose';
import Connect from './Connect';
import Focus from './Focus';
import { ROUTES, ROUTE_NAME } from './util';
import PeerManager from './PeerManager';
import MessageManager from './MessageManager';
import PostMessage from './PostMessage';
import TorrentManager from './TorrentManager';
import TopicPage from './TopicPage';
import Topics from './Topics';
import UserPostPage from './UserPostPage';


const DEFAULT_TOPICS = [
  {label: "children", value: true, color: "GREEN"},
  {label: "comics", value: true, color: "GREEN"},
  {label: "commerce", value: true, color: "GREEN"},
  {label: "crypto currency", value: true, color: "GREEN"},
  {label: "culture", value: true, color : "GREEN"},
  {label: "food", value: true, color: "GREEN"},
  {label: "football", value: true, color: "GREEN"},
  {label: "game", value: true, color: "GREEN"},
  {label: "movies", value: true, color: "GREEN"},
  {label: "travel", value: true, color: "GREEN"}
];

const THEMES = [
  {name: "light", textColor: "black", optionColor:"black", borderColor:"", backgroundColor:"white", insideColor: "white", headerColor: "", topicColor:"#cdc9cd", stackedbarBackground: "#e8e8e8" },
  {name: "dark", textColor: "white", optionColor:"red", borderColor:"white", backgroundColor:"black", insideColor: "black", headerColor: "grey", topicColor:"black", stackedbarBackground: "#e8e8e8" }
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { sender, configStore, useConnector } = props;
    const storedTopics = configStore.get('topics') || [];
    const storedUsers = configStore.get('users') || [];
    const storedTheme = configStore.get('theme') || null;
    this.state = {
      numPeers: 0,
      messages: new Map(),
      route: ROUTES.feed,
      routeParams: null,
      topics: storedTopics.length > 0 ? storedTopics : DEFAULT_TOPICS,
      users: storedUsers.length > 0 ? storedUsers : [
        {id: sender.id, name: sender.name}
      ],
      theme: storedTheme !== null ? storedTheme : THEMES[0],
      themesList: THEMES,
    };
    this.torrentManager = new TorrentManager();
    this.peerManager = new PeerManager({
      sender,
      useConnector,
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

  changeTheme = (theme) => {
    const newTheme = this.state.themesList.filter( x => x.name === theme )[0];
    this.props.configStore.set('theme', newTheme);
    this.setState( {theme:newTheme} );
  }

  handleStackPop = () => {
    const { routeParams } = this.state;

    const path = routeParams.backTrace[routeParams.backTrace.length-1].page;

    routeParams.filter = routeParams.backTrace[routeParams.backTrace.length-1].filter;
    routeParams.backTrace = routeParams.backTrace.filter( x => x.value != routeParams.backTrace[routeParams.backTrace.length-1].value );

    this.setState( {route:path} );
  };

  handleClickPage = (pageId) => {
    this.setState({ route: pageId, searchedKeyword: null });
  };

  navigate = (route, routeParams) => {
    routeParams.backTrace.push( { filter: routeParams.oldFilter, page: this.state.route, value: routeParams.backTrace[routeParams.backTrace.length-1].value + 1 } );
    this.setState({ route, routeParams });
  };

  handleChangeFollowedUser = ( id, name, value ) => {

    let newUsers = Object.assign([], this.state.users).filter( x => x );

    if( value === true ){
      newUsers.push({ id: id, name: name });
    }
    else{
      newUsers = newUsers.filter( x => x.id !== id );
    }

    this.props.configStore.set('users', newUsers);
    this.setState({users:newUsers });
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

    this.props.configStore.set('topics', newTopics);
    this.setState({topics:newTopics});
  };

  handleSearchClick = (keyword) => {
    console.log(`[SearchClick] ${this.state.searchedKeyword}`);
    this.setState({ route: ROUTES.search, searchedKeyword: keyword });
  };
  changeBackgroundColor = (color) => {
    let newTheme = this.state.theme;
    newTheme.backgroundColor = color;
    this.props.configStore.set('theme', newTheme);
    this.setState( {theme : newTheme} );
  };

  renderPage = () => {
    const { route, routeParams, searchedKeyword, theme } = this.state;
    const feedMessages = this.messageManager.getFeedMessages(this.state.topics, this.state.users);
    switch (route) {
      case ROUTES.connect:
        return <Connect peerManager={this.peerManager}/>;
      case ROUTES.search:
        const searchedMessages = this.messageManager.getSearchedMessages(searchedKeyword);
        return (
          <Feed
            topSwing={'55px'}
            backTrace={[ { filter: "", page: ROUTES.search, value: 1 } ]}
            messages={searchedMessages}
            navigate={this.navigate}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
            controlVote={this.messageManager.controlVote}
            theme={theme}
          />
        );
      case ROUTES.Fresh:
        const freshMessages = this.messageManager.getAllMessages();
        return (
          <Feed
            topSwing={'55px'}
            backTrace={ [ { filter: "", page: ROUTES.Fresh, value: 1 } ] }
            messages={freshMessages}
            navigate={this.navigate}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
            controlVote={this.messageManager.controlVote}
            theme={theme}
          />
        );
      case ROUTES.trending:
        const messages = this.messageManager.getAllMessages();
        return (
          <Feed
            topSwing={'55px'}
            backTrace={ [ { filter: "", page: ROUTES.trending, value: 1 } ] }
            messages={messages}
            navigate={this.navigate}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
            sortByUpvotes={true}
            controlVote={this.messageManager.controlVote}
            theme={theme}
          />
        );
      case ROUTES.feed:
        return (
          <Feed
            topSwing={'55px'}
            backTrace={ [ { filter: "", page: ROUTES.feed, value: 1 } ] }
            messages={feedMessages}
            navigate={this.navigate}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
            controlVote={this.messageManager.controlVote}
            theme={theme}
          />
        );
      case ROUTES.Profile:
        return (
          <Profile
            backTrace={ [ { filter: "", page: ROUTES.Profile, value: 1 } ] }
            users={this.state.users}
            topics={this.state.topics}
            myself={this.props.sender}
            navigate={this.navigate}
            getTotalPostOfUser={this.messageManager.getTotalPostOfUser}
            getTotalCommentOfUser={this.messageManager.getTotalCommentOfUser}
            getTotalUpVotesOfUser={this.messageManager.getTotalUpVotesOfUser}
            getTotalDownVotesOfUser={this.messageManager.getTotalDownVotesOfUser}
            changeBackgroundColor={this.changeBackgroundColor}
            theme={theme}
            changeTheme={this.changeTheme}
            configStore={this.props.configStore}
          />
        );
      case ROUTES.focus:
        const focusMessage = feedMessages.filter(message =>
        message.messageId === routeParams.filter)[0];
        return (
          <Focus
            filter={routeParams.filter}
            backTrace={routeParams.backTrace}
            message={focusMessage}
            navigate={this.navigate}
            postComment={this.messageManager.postComment}
            backNavigation={this.handleStackPop}
            upvote={this.messageManager.upvote}
            downvote={this.messageManager.downvote}
            controlVote={this.messageManager.controlVote}
            theme={theme}
          />
        );
      case ROUTES.postMessage:
        return (
          <PostMessage
            postMessage={this.messageManager.postMessage}
            seedAsTorrent={this.torrentManager.seed}
            theme={theme}
          />
        );
      case ROUTES.TopicPage:
        const filter = this.state.topics.filter(x => x.label === routeParams.filter.label );
        const filteredMessages = this.messageManager.getFilteredMessagesByTopic(filter[0]);
        return (
            <TopicPage
                topSwing={'107px'}
                filter={filter[0]}
                backTrace={routeParams.backTrace}
                messages={filteredMessages}
                navigate={this.navigate}
                upvote={this.messageManager.upvote}
                downvote={this.messageManager.downvote}
                handleChangeTopicInSinglePage={this.handleChangeTopic}
                backNavigation={this.handleStackPop}
                controlVote={this.messageManager.controlVote}
                theme={theme}
            />
        );
      case ROUTES.UserPostPage:
        const filteredUserMessages = this.messageManager.getFilteredMessagesByUser(routeParams.filter);
        const search = Object.assign([], this.state.users).filter( x => x.id === routeParams.filter );
        let searchResult = false;
        if( search.length > 0 )
          searchResult = true;
        return (
            <UserPostPage
                topSwing={'107px'}
                searchResult={searchResult}
                filter={routeParams.filter}
                backTrace={routeParams.backTrace}
                messages={filteredUserMessages}
                navigate={this.navigate}
                backNavigation={this.handleStackPop}
                upvote={this.messageManager.upvote}
                downvote={this.messageManager.downvote}
                handleChangeUserInSinglePage={this.handleChangeFollowedUser}
                controlVote={this.messageManager.controlVote}
                theme={theme}
            />
        );
      case ROUTES.topics:
        return (
          <Topics
            backTrace={ [ { filter: "", page: ROUTES.topics, value: 1 } ] }
            navigate={this.navigate}
            topicsList={this.state.topics}
            handleChangeTopic={this.handleChangeTopic}
            getTotalPostOfTopic={this.messageManager.getTotalPostOfTopic}
            getTotalCommentOfTopic={this.messageManager.getTotalCommentOfTopic}
            getTotalUpVotesOfTopic={this.messageManager.getTotalUpVotesOfTopic}
            getTotalDownVotesOfTopic={this.messageManager.getTotalDownVotesOfTopic}
            theme={theme}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { numPeers, route } = this.state;
    const page = this.renderPage();
    const pageIds = Object.keys(ROUTE_NAME);
    const pages = pageIds.map(id => ({id, name: ROUTE_NAME[id]}));
    return (
      <div>
        {`Peers #: ${numPeers}`}
        <NavigationBar
          pages={pages}
          activePage={route}
          onClickPage={this.handleClickPage}
          onLogout={this.props.onLogout}
          onSearchClick={this.handleSearchClick}
        />
        {page}
      </div>
    );
  }
}
