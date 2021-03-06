import React from 'react';
import { ROUTES } from './util';
import MessageCard from './MessageCard';
import Card from "react-bootstrap/Card";
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player'

let styles = {

  div: {
        height:'100%',
        overflowY: 'auto',
        //background: #58B14C url("http://i62.tinypic.com/15xvbd5.png") no-repeat scroll 319px center;
  },

  messageCard: {
        width: '40%',
        left: '30%',
        height: 'auto',
  },

  video: {
        width: '40%',
  }

}

export default class Feed extends React.Component {

  constructor(props) {
      super(props);
      this.state = { height:"", width:""  };
  }

  handleClick = (message) => {
    const { navigate, backTrace } = this.props;
    navigate(ROUTES.focus, { oldFilter: this.props.filter, filter: message.messageId, backTrace: backTrace});
  };

  handleUserClick = (senderId) => {
    const { navigate, backTrace } = this.props;
    navigate(ROUTES.UserPostPage, { oldFilter:this.props.filter, filter: senderId, backTrace: backTrace });
  };

  handleTopicPage = ( topic ) => {
      const { navigate, backTrace } = this.props;
      navigate(ROUTES.TopicPage, { oldFilter:this.props.filter, filter: topic, backTrace: backTrace });
  };

  render () {
    const { messages, upvote, downvote, backTrace, sortByUpvotes, backgroundColor } = this.props;
    const { height, width } = this.state;
    if (sortByUpvotes) {
      messages.sort((a, b) => b.votes.length - a.votes.length);
    } else {
      messages.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }
    return (
      <div style={{position:'fixed',top:this.props.topSwing,overflowY:'auto',left:0,width:'100%',bottom:0,backgroundColor:this.props.theme.backgroundColor}}>
        {messages.map(message =>
          <MessageCard
            key={message.messageId}
            message={message}
            onClick={() => this.handleClick(message)}
            isPreview={true}
            upVote={upvote} 
            downVote={downvote}
            handleTopicPage = {this.handleTopicPage}
            handleUserClick = {this.handleUserClick}
            controlVote={this.props.controlVote}
            theme={this.props.theme}
          />
        )}
      </div>
    );
  }
}