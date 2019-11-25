import React from 'react';
import { ROUTES } from './util';
import MessageCard from './MessageCard';
import Card from "react-bootstrap/Card";
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player'

const styles = {

  div: {
        borderRadius: '9px',
        borderRadiusInputTopLeft: '9px',
        borderRadiusInputTopRight: '9px',
        borderRadiusInputBottomLeft: '9px',
        borderRadiusInputBottomRight: '9px',
        topLeftMode: 'true',
        topRightMode: 'true',
        bottomLeftMode: 'true',
        bottomRightMode: 'true',
        shadowOffset: {widht:2, height: 2},
        shadowRadius: '20px',
        shadowColor: '#330033',
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
    const { navigate } = this.props;
    navigate(ROUTES.focus, { messageId: message.messageId });
  };

  render () {
    const { messages, upvote, downvote } = this.props;
    const { height, width } = this.state;
    messages.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    return (
      <div style={styles.div} >
        {messages.map(message =>
          <MessageCard
            key={message.messageId}
            message={message}
            onClick={() => this.handleClick(message)}
            isPreview={true}
            upVote={upvote} 
            downVote={downvote}
          />
        )}

      </div>
    );
  }
}