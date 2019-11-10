import React from 'react';
import Card from 'react-bootstrap/Card';
import { ROUTES } from './util';

export default class Feed extends React.Component {

  handleClick = (message) => {
    const { navigate } = this.props;
    navigate(ROUTES.focus, { messageId: message.messageId });
  };

  render () {
    const { messages } = this.props;
    messages.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    return (
      <div>
        {messages.map(message =>
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
        )}
      </div>
    );
  }
}