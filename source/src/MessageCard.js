import React from 'react';
import Card from 'react-bootstrap/Card';

export default ({message, onClick}) => {
  let aggregateVotes = 0;
  for (const vote of message.votes) {
    aggregateVotes += parseInt(vote.delta);
  }
  return (
    <Card
      style={{ width: '18rem', margin: '0 auto', cursor: 'pointer' }}
      key={message.messageId}
      onClick={onClick}
    >
      <Card.Body>
        {/*<Card.Title>{message.from}</Card.Title>*/}
        <Card.Subtitle className="mb-2 text-muted">{message.senderName}</Card.Subtitle>
        <Card.Text>
          {message.title}
        </Card.Text>
        <Card.Text>
          {message.text}
        </Card.Text>
        <Card.Text>
          {`Topics: ${JSON.stringify(message.topics)}`}
        </Card.Text>
        <Card.Text>
          {`Voted: ${aggregateVotes}`}
        </Card.Text>
        <Card.Subtitle style={{fontSize: 8}}>by {message.senderId}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
};