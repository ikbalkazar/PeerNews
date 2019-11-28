import React from 'react';
import { ROUTES } from './util';
import MessageCard from './MessageCard';
import Card from "react-bootstrap/Card";
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = {

  div: {
        width: '80%',
        float: 'right',
        borderRadius: '9px',
        borderRadiusInputTopLeft: '9px',
        borderRadiusInputTopRight: '9px',
        borderRadiusInputBottomLeft: '9px',
        borderRadiusInputBottomRight: '9px',
        shadowOffset: {widht:2, height: 2},
        shadowRadius: '20px',
        shadowColor: '#330033',
        //background: #58B14C url("http://i62.tinypic.com/15xvbd5.png") no-repeat scroll 319px center;
  },

  messageCard: {
        width: '40%',
        left: '-20%',
        height: 'auto',
  },

  video: {
        width: '40%',
  },

  root: {
    width:"20%", float:"left",
    marginTop: "0%",
    border: '5px solid green',
    float:"left"
  },
  formControl: {
  },
}

export default class Feed extends React.Component {

  constructor(props) {
      super(props);
      this.state = { 
        height:"", 
        width:"" ,
        followedTopics: this.props.followedTopics,
        messages: this.props.messages,
        upvote: this.props.upvote,
        downvote: this.props.downvote,
      };
  }

  handleClick = (message) => {
    const { navigate } = this.props;
    navigate(ROUTES.focus, { messageId: message.messageId, backTrace: ROUTES.feed, filter: this.state.followedTopics });
  };

  handleTopicSelect = (label, event) => {

    const index = this.state.followedTopics.findIndex((topic)=> {
        return (topic.label === label);
    })

    const topic = Object.assign({}, this.state.followedTopics[index]);

    topic.value = event.target.checked;

    const newfollowedTopics = Object.assign([], this.state.followedTopics);
    newfollowedTopics[index] = topic;

    const filteredMessages = this.props.getGlobalMessagesFilteredByTopics( newfollowedTopics );
    this.setState({messages:filteredMessages, followedTopics:newfollowedTopics});
  };

  render () {
    const { messages, upvote, downvote } = this.state;
    const { height, width, followedTopics } = this.state;
    messages.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    return (
      <div>
        <div style={styles.root}>
          <FormControl component="fieldset" style={styles.formControl}>
            <FormLabel component="legend" style={{textAlign:"left"}} >Select topics</FormLabel>
            {followedTopics.map((topic, index) => 
              <FormGroup key = {topic.label}>
                <FormControlLabel
                  label={topic.label}
                  control={<Checkbox checked={topic.value} onChange={this.handleTopicSelect.bind(this,topic.label)}/>} 
                />
              </FormGroup>
            )}
          </FormControl>
        </div>
        <div style={styles.div} >
          {messages.map(message =>
            <MessageCard
              key={message.messageId}
              message={message}
              onClick={() => this.handleClick(message)}
              isPreview={true}
              upVote={upvote} 
              downVote={downvote}
            /> 
          )}
        </div>
      </div>
    );
  }
}