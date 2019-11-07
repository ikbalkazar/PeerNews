import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ROUTES } from './util';

export default class Focus extends React.Component {
  handleClickBack = (event) => {
    event.preventDefault();
    const { navigate } = this.props;
    navigate(ROUTES.feed, {});
  };

  render () {
    const { message } = this.props;
    return (
      <div>
        <Button variant="primary" onClick={this.handleClickBack}>
          {'< Back'}
        </Button>
        <Card style={{ width: '18rem', margin: '0 auto' }} key={message.messageId}>
          <Card.Body>
            {/*<Card.Title>{message.from}</Card.Title>*/}
            <Card.Subtitle className="mb-2 text-muted">{message.senderId}</Card.Subtitle>
            <Card.Text>
              {message.text}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}