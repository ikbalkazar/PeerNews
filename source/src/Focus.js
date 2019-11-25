import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageCard from './MessageCard';
import { ROUTES } from './util';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
      marginLeft:"300px",
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

class ComposeComment extends React.Component {

  state = {
    comment: '',
    name: '',
    open : false,
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ comment: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({open:false});
    const { comment } = this.state;
    const { postComment } = this.props;
    if (comment.length > 0) {
      postComment(comment);
      this.setState({ comment: '' });
    }
  };

  handleOpen = () => {
    this.setState({open:true});
  };

  handleClose = () => {
    event.preventDefault();
    this.setState({open:false});
  };

  render() {
    const { comment, open } = this.state;
    return (
      <div>
      <Dialog open={open} onClose={this.handleClose} maxWidth="md" fullWidth="true" aria-labelledby="max-width-dialog-title">
        <DialogContent>
          <DialogContentText style={{textAlign:"center"}}>
           <b>Add new comment to post:</b>
          </DialogContentText>
          <Form style={{padding: 20, width: 900}}>
            <Form.Group>
              <Form.Control type="text" placeholder="Enter new comment" value={comment} onChange={this.handleChange} />
            </Form.Group>
            <Button variant="danger" style={{marginLeft:"10px"}} type="submit" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="success" style={{marginLeft:"705px"}} type="submit" onClick={this.onSubmit}>
              Submit
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
      </div>
    );
  }
}

export default class Focus extends React.Component {
  handleClickBack = (event) => {
    event.preventDefault();
    const { navigate } = this.props;
    navigate(ROUTES.feed, {});
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
              <GoThumbsup size={30} style={styles.goThumbsupFocus} />
              <b style={styles.commentNumber}> TODO </b>
              <GoThumbsdown size={30} style={styles.goThumbsdownFocus} />
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    );
  };

  render () {
    const { message } = this.props;
    return (
      <Container fluid>
        <Button variant="primary" onClick={this.handleClickBack}>
          {'< Back'}
        </Button>
        <Row><Col>
          <MessageCard message={message} commentHandler={() => this.handleOpen() }/>
        </Col></Row>
        <Row className="justify-content-md-center">
          <ComposeComment postComment={this.postComment}/>
        </Row>
        <Row><Col>
          <h5 style={{textAlign: 'center', paddingTop: 50}}>Comments</h5>
          {message.comments.map(comment => this.renderCard(comment))}
        </Col></Row>
        
      </Container>
    );
  }
}