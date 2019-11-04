import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Compose extends React.Component {
  state = {
    message: '',
  };

  handleMessage = event => {
    event.preventDefault();
    this.setState({ message: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { message } = this.state;
    const { postMessage } = this.props;
    if (message.length > 0) {
      postMessage(message);
      this.setState({ message: '' });
    }
  };

  render () {
    const { message } = this.state;
    return (
      <Form style={{padding: 20}}>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control type="text" placeholder="Enter message" value={message} onChange={this.handleMessage} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={this.onSubmit}>
          Submit
        </Button>
      </Form>
    );
  }
}