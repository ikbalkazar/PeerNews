import React from 'react';
import Card from 'react-bootstrap/Card';
import { ROUTES } from './util';

export default class Feed extends React.Component {

  handleClick = (message) => {
    const { navigate } = this.props;
    navigate(ROUTES.focus, { message });
  };

  render () {
    const { messages } = this.props;
    const messageContents = Object.values(messages);
    messageContents.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    return (
      <div>
        {messageContents.map(message =>
          <Card
            style={{ width: '18rem', margin: '0 auto' }}
            key={message.messageId}
            onClick={() => this.handleClick(message)}
          >
            <Card.Body>
              {/*<Card.Title>{message.from}</Card.Title>*/}
              <Card.Subtitle className="mb-2 text-muted">{message.senderId}</Card.Subtitle>
              <Card.Text>
                {message.text}
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>
    );
  }
}