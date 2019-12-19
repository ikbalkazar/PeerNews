import React from 'react';
import Button from 'react-bootstrap/Button';

export default class Connect extends React.Component {
  state = {
    requestSignal: null,
    responseSignal: null,
    initiatorSignal: null,
    requestResponseSignal: null,
  };

  componentDidMount() {
    const { peerManager } = this.props;
    peerManager.initiateManually((signal) => {
      this.setState({initiatorSignal: signal});
    });
  }

  handleRequest = (event) => {
    event.preventDefault();
    this.setState({ requestSignal: event.target.value });
  };

  handleResponse = (event) => {
    event.preventDefault();
    this.setState({ responseSignal: event.target.value });
  };

  onSubmitResponse = (event) => {
    event.preventDefault();
    const { responseSignal } = this.state;
    const { peerManager } = this.props;
    peerManager.applyResponseManually(responseSignal);
  };

  onSubmitRequest = (event) => {
    event.preventDefault();
    const { requestSignal } = this.state;
    const { peerManager } = this.props;
    peerManager.applyRequestManually(requestSignal, (signal) => {
      this.setState({ requestResponseSignal: signal });
    });
  };

  render() {
    const { initiatorSignal, requestSignal, responseSignal, requestResponseSignal } = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>Connect Manually</h3>
        <input value={initiatorSignal}/>
        <input value={responseSignal} onChange={this.handleResponse}/>
        <Button onClick={this.onSubmitResponse}>
          Submit Response
        </Button>
        <input value={requestSignal} onChange={this.handleRequest}/>
        <Button onClick={this.onSubmitRequest}>
          Submit Request
        </Button>
        <input value={requestResponseSignal}/>
      </div>
    );
  }
}