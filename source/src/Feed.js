import React from 'react';
import { ROUTES } from './util';
import MessageCard from './MessageCard';

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
          <MessageCard
            key={message.messageId}
            message={message}
            onClick={() => this.handleClick(message)}
            isPreview={true}
          />
        )}
      </div>
    );
  }
}