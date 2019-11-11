import React from 'react';
import ConfigStore from './ConfigStore';
import { createSender } from './message';
import App from './app';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  encodeBase64,
} from 'tweetnacl-util';


class Username extends React.Component {
  state = {
    username: '',
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ username: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { username } = this.state;
    const { onSubmit } = this.props;
    if (username.length > 3) {
      onSubmit(username);
    }
  };

  render() {
    const { username } = this.state;
    return (
      <Form style={{padding: 20, textAlign: 'center'}}>
        <h4 style={{marginBottom: 100}}>Welcome to PeerNews</h4>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={this.handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={this.onSubmit}>
          Create Account
        </Button>
      </Form>
    );
  }
}

class DisplayKeys extends React.Component {
  render() {
    const { keyPair, onNext } = this.props;
    const { privateKey, publicKey } = keyPair;
    return (
      <div style={{textAlign: 'center', padding: 20}}>
        <h4>Take a note of your keys!</h4>
        <h5>Private Key</h5>
        <p>{encodeBase64(privateKey)}</p>
        <h5>Public Key</h5>
        <p>{encodeBase64(publicKey)}</p>
        <Button
          variant="primary"
          type="submit"
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    );
  }
}

export default class Boot extends React.Component {
  constructor(props) {
    super(props);
    this.configStore = new ConfigStore();
    const sender = this.configStore.get('sender');
    this.state = {
      sender: null, // TODO: set to sender and add logout functionality
      tempSender: null,
      username: null,
    };
  }

  onSubmitUsername = (username) => {
    this.setState({ username });
    const sender = createSender(username);
    this.configStore.set('sender', sender);
    this.setState({ tempSender: sender });
  };

  onFinish = () => {
    const { tempSender } = this.state;
    this.setState({ sender: tempSender });
  };

  render() {
    const { sender, tempSender, username } = this.state;
    if (sender !== null) {
      return <App sender={sender}/>;
    } else {
      if (!username) {
        return <Username onSubmit={this.onSubmitUsername}/>;
      } else {
        return <DisplayKeys keyPair={tempSender.keyPair} onNext={this.onFinish}/>;
      }
    }
  }
}