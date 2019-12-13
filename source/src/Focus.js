import React from 'react';
import Card from 'react-bootstrap/Card';
import MessageCard from './MessageCard';
import { ROUTES } from './util';
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';
import StackedBar from './StackedBar';

const styles = {

  messageCardFocus: {
        width: '60%',
        left: '20%',
        height: 'auto',
        cursor: 'pointer',
  },

  goThumbsupFocus: {
      marginLeft:"340px",
      marginBot:"0px",
  },

  goThumbsdownFocus: {
      marginLeft:"10px",
      marginBot:"0px",
  },

  commentNumber: {
      marginLeft:"10px",
      marginBot:"0px",
  }
}

const PopOverPublicID = (userID) => {
    return (
      <Popover id="popover-basic" onClick={() => {navigator.clipboard.writeText(userID)}} style={{cursor:'pointer'}}>
        <Popover.Title as="h3">Click to copy</Popover.Title>
        <Popover.Content>
          <b> {userID} </b>
        </Popover.Content>
      </Popover>
    )
}

export default class Focus extends React.Component {

  postComment = (comment) => {
    const { message, postComment } = this.props;
    postComment(message.messageId, comment);
  };

  handleUserClick = (senderId) => {
    const { navigate, backTrace } = this.props;
    navigate(ROUTES.UserPostPage, { oldFilter:this.props.filter, filter: senderId, backTrace: backTrace });
  };

  handleTopicPage = ( topic ) => {
      const { navigate, backTrace } = this.props;
      navigate(ROUTES.TopicPage, { oldFilter:this.props.filter, filter: topic, backTrace: backTrace });
  };


  renderCard = (message) => {
    const messageCard = {
        width: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 'auto',
        cursor: 'pointer',
        backgroundColor: this.props.theme.insideColor,
        color: this.props.theme.textColor,
        borderColor: this.props.theme.borderColor
  }
    return (
      <Card
        key={message.messageId}
        message={message}
        style={messageCard}
      > 
        <Card.Body>
          <Card.Text>
            {message.text}
          </Card.Text>
          <blockquote className="blockquote mb-0">
            <footer className="blockquote-footer">
              <OverlayTrigger
                placement="right" delay={{ show: 250, hide: 800 }} overlay={PopOverPublicID(message.senderId)}
              >
                <cite>{message.senderName} @{ message.senderId.substring(0,10)+'...' }</cite>
              </OverlayTrigger>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    );
  };

  render () {
    const { message, upvote, downvote } = this.props;
    if (!message) {
      return null;
    }
    return (
      <div style={{position:'fixed', overflowY:'auto', top:'55px',left:0,width:'100%', bottom:0, backgroundColor:this.props.theme.backgroundColor}}>
      <div>
        <StackedBar
          title={message.title}
          onBack={this.props.backNavigation}
          noRight={true}
          theme={this.props.theme}
        />
        <div style={{marginTop: '55px', zIndex:1}}>
          <MessageCard 
              message={message} 
              postComment={this.postComment} 
              upVote={upvote} 
              downVote={downvote} 
              handleTopicPage = {this.handleTopicPage}
              handleUserClick = {this.handleUserClick}
              controlVote={this.props.controlVote}
              theme={this.props.theme}
          />
          <h5 style={{textAlign: 'center', paddingTop: 50, color:this.props.theme.textColor}}>Comments</h5>
          {message.comments.map(comment => this.renderCard(comment))}
        </div>
      </div>
      </div>
    );
  }
}