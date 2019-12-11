import React from 'react';
import { ROUTES } from './util';
import Card from "react-bootstrap/Card";
import Feed from './Feed';
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';
import StackedBar from './StackedBar';

const styles = {

  div: {
        topLeftMode: 'true',
        topRightMode: 'true',
        bottomLeftMode: 'true',
        bottomRightMode: 'true',
        shadowOffset: {widht:2, height: 2},
        shadowRadius: '20px',
        shadowColor: '#330033',
        //background: #58B14C url("http://i62.tinypic.com/15xvbd5.png") no-repeat scroll 319px center;
  },

  messageCard: {
        width: '40%',
        left: '30%',
        height: 'auto',
  },

  video: {
        width: '40%',
  }
}

const PopOverPublicID = (value) => {
    return (
      <Popover id="popover-basic" style={{cursor:'pointer'}} >
      {
          value === true  ?
          <Popover.Title as="h3">Click to follow</Popover.Title>
          :
          <Popover.Title as="h3">Click to unfollow</Popover.Title>
      }
      </Popover>
    )
}


export default class TopicPage extends React.Component {

  constructor(props) {
      super(props);
      this.state = { height:"", width:""  };
  };

  unfollowTopic = () => {
    this.props.handleChangeTopicInSinglePage( this.props.filter.label, false );
  };

  followTopic = () => {
    this.props.handleChangeTopicInSinglePage( this.props.filter.label, true );
  };

  render () {
    const { navigate, messages, upvote, downvote, filter, backTrace } = this.props;
    const { height, width } = this.state;
    return (
        <div>
            <StackedBar
              title={filter.label}
              onBack={this.props.backNavigation}
              isRightOn={filter.value}
              onRightOnClick={this.followTopic}
              rightOnTitle="Follow"
              onRightOffClick={this.unfollowTopic}
              rightOffTitle="Unfollow"
            />
            <div style={{marginTop: "54px", paddingTop: 0, zIndex:1, height:'100%', overflowY: 'auto' }}>
              <Feed
                  backTrace={backTrace}
                  filter={filter}
                  messages={messages}
                  navigate={navigate}
                  upvote={upvote}
                  downvote={downvote}
                  controlVote={this.props.controlVote}
                  theme={this.props.theme}
              />
            </div>
        </div>
    );
  }
}