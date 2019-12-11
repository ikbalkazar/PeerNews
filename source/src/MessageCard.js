import React from 'react';
import Card from 'react-bootstrap/Card';
import MediaViewer from './MediaViewer';
import Button from 'react-bootstrap/Button';
import ComposeComment from './ComposeComment';
import {ButtonToolbar} from 'react-bootstrap';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';

const styles = {

  div: {
        topLeftMode: 'true',
        topRightMode: 'true',
        bottomLeftMode: 'true',
        bottomRightMode: 'true',
        shadowOffset: {widht:2, height: 2},
        shadowRadius: '20px',
        shadowColor: '#330033',
        //background: #58B14C url("http://i62.tinypic.com/15xvbd5.png") no-repeat scroll 319px center;
  },

  goThumbsup: {
      marginLeft:"10px",
      marginTop:"-10px",
  },

  goThumbsupFocus: {
      marginLeft:"10px",
  },

  goThumbsdown: {
      marginLeft:"10px",
      marginTop:"-10px",
  },

  goThumbsdownFocus: {
      marginLeft:"10px",
  },

  commentNumber: {
      marginLeft:"350px",
      marginTop:"-50px",
  },

  commentNumberFocus: {
      marginLeft:"550px",
  },

  video: {
        width: '100%',
  },

  videoFocus: {
        width: '100%',
  },

}

const PopOverPublicID = (userID) => {
    return (
      <Popover id="popover-basic" onClick={() => {navigator.clipboard.writeText(userID)}} style={{cursor:'pointer'}} >
        <Popover.Title as="h3">Click to copy</Popover.Title>
        <Popover.Content>
          <b> {userID} </b>
        </Popover.Content>
      </Popover>
    )
}

const shorten = (s) => {
  if (s.length < 100) {
    return s;
  }
  return s.substring(0, 100) + '...';
};

export default ({message, onClick, isPreview, postComment, upVote, downVote, handleTopicPage, handleUserClick, controlVote, theme}) => {
  let aggregateVotes = 0;
  for (const vote of message.votes) {
    aggregateVotes += parseInt(vote.delta);
  }

  const messageCard = {
        width: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 'auto',
        cursor: 'pointer',
        backgroundColor: theme.insideColor,
        color: theme.textColor,
        borderColor: theme.borderColor
  }
  const messageCardFocus = {
        width: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 'auto',
        cursor: 'pointer',
        backgroundColor: theme.insideColor,
        color: theme.textColor,
        borderColor: theme.borderColor
  }

  const handleClick = isPreview ? onClick : () => {};
  const messageText = isPreview ? shorten(message.text) : message.text;
  const senderId = message.senderId.substring(0, 10) + '...';
  const commentNumberStyle = isPreview ? styles.commentNumber : styles.commentNumberFocus;
  const mediaURL = message.media || message.video || message.image;
  const previousVote = controlVote( message.messageId );
  return (
    <div>
      <Card
        key={message.messageId}
        message={message}
        className="rounded"
        style={ isPreview ? messageCard : messageCardFocus }
      >
        {isPreview &&
          <Card.Header
            onClick={handleClick}
            style={{textAlign:'left', color: theme.textColor, backgroundColor: theme.headerColor, fontWeight: '800'}}
          >
            {message.title}
          </Card.Header>
        }
        {mediaURL &&
          <MediaViewer mediaURL={mediaURL}/>
        }
        <Card.Body className="message-card-body">
          <Card.Text onClick={handleClick}>{messageText}</Card.Text>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minHeight: 30}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <cite onClick={() => handleUserClick(message.senderId)}>{message.senderName} </cite>
              <OverlayTrigger
                placement="right" delay={{ show: 250, hide: 800 }} overlay={PopOverPublicID(message.senderId)}
              >
              <cite>@{senderId}</cite>
              </OverlayTrigger>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              {
                previousVote === 1 ?
                  <GoThumbsup size={25} style={{marginTop: -4, color: "blue"}} onClick={() => upVote(message.messageId)} />
                  :
                  <GoThumbsup size={25} style={{marginTop: -4}} onClick={() => upVote(message.messageId)} />
              }
              <b style={{marginLeft: 10, marginRight: 10}}> {aggregateVotes} </b>
              {
                previousVote === -1 ?
                  <GoThumbsdown size={25} style={{marginTop: 4, color : "red"}} onClick={() => downVote(message.messageId)} />
                  :
                  <GoThumbsdown size={25} style={{marginTop: 4}} onClick={() => downVote(message.messageId)} />
              }
              {!isPreview &&
                <ComposeComment postComment={postComment}/>
              }
            </div>
          </div>
          <ButtonToolbar style={{marginLeft: -5}}>
            {message.topics.map( topic =>
              <Button
                key="topic"
                style={{marginLeft:"5px", marginTop:"5px"}}
                variant="outline-success"
                onClick={() => handleTopicPage(topic)}
              >
                {topic.label}
              </Button>
            )}
          </ButtonToolbar>
        </Card.Body>
      </Card>
    </div>
  );
};