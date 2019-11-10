import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ROUTES } from './util';

class ComposeComment extends React.Component {
  state = {
    comment: '',
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ comment: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { comment } = this.state;
    const { postComment } = this.props;
    if (comment.length > 0) {
      postComment(comment);
      this.setState({ comment: '' });
    }
  };

  render() {
    const { comment } = this.state;
    return (
      <Form style={{padding: 20, maxWidth: 600}}>
        <Form.Group>
          <Form.Label>Comment</Form.Label>
          <Form.Control type="text" placeholder="Enter comment" value={comment} onChange={this.handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={this.onSubmit}>
          Submit
        </Button>
      </Form>
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
        style={{ width: '18rem', margin: '0 auto', cursor: 'pointer' }}
        key={message.messageId}
        onClick={() => this.handleClick(message)}
      >
        <Card.Body>
          {/*<Card.Title>{message.from}</Card.Title>*/}
          <Card.Subtitle className="mb-2 text-muted">{message.senderName}</Card.Subtitle>
          <Card.Text>
            {message.text}
          </Card.Text>
          <Card.Subtitle style={{fontSize: 8}}>by {message.senderId}</Card.Subtitle>
        </Card.Body>
      </Card>
    );
  };

  render () {
    const { message } = this.props;
    return (
      <Container fluid>
        <Row>
          <Button variant="primary" onClick={this.handleClickBack}>
            {'< Back'}
          </Button>
        </Row>
        <Row><Col>
        {this.renderCard(message)}
        </Col></Row>
        <Row><Col>
          <h5 style={{textAlign: 'center', paddingTop: 50}}>Comments</h5>
          {message.comments.map(comment => this.renderCard(comment))}
        </Col></Row>
        <Row className="justify-content-md-center">
          <ComposeComment postComment={this.postComment}/>
        </Row>
      </Container>
    );
  }
}