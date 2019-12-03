import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageCard from './MessageCard';
import { ROUTES } from './util';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';


const styles = {

  messageCard: {
        width: '40%',
        left: '30%',
        height: 'auto',
        cursor: 'pointer',
  },

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
  handleClickBack = (event) => {
    event.preventDefault();
    const { navigate, backTrace } = this.props;
    navigate( backTrace[backTrace.length-1].page, { backTrace: backTrace.filter( x => x.value != backTrace[backTrace.length-1].value ), filter: backTrace[backTrace.length-1].filter });
  };

  postComment = (comment) => {
    const { message, postComment } = this.props;
    postComment(message.messageId, comment);
  };

  renderCard = (message) => {
    return (
      <Card
        key={message.messageId}
        message={message}
        style={ styles.messageCard }
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
              <GoThumbsup size={20} style={styles.goThumbsupFocus} />
              <b style={styles.commentNumber}> TODO </b>
              <GoThumbsdown size={20} style={styles.goThumbsdownFocus} />
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    );
  };

  render () {
    const { message, upvote, downvote } = this.props;
    return (
      <Container fluid>
        <Button variant="primary" onClick={this.handleClickBack}>
          {'< Back'}
        </Button>
        <Row><Col>
          <MessageCard message={message} postComment={this.postComment} upVote={upvote} downVote={downvote} />
        </Col></Row>
        <Row><Col>
          <h5 style={{textAlign: 'center', paddingTop: 50}}>Comments</h5>
          {message.comments.map(comment => this.renderCard(comment))}
        </Col></Row>
        
      </Container>
    );
  }
}