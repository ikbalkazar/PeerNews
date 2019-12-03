import React from 'react';
import { ROUTES } from './util';
import Card from "react-bootstrap/Card";
import Feed from './Feed';
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import Button from "react-bootstrap/Button";
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';

const styles = {

  div: {
        borderRadius: '9px',
        borderRadiusInputTopLeft: '9px',
        borderRadiusInputTopRight: '9px',
        borderRadiusInputBottomLeft: '9px',
        borderRadiusInputBottomRight: '9px',
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

    handleBack = () => {
        const { navigate, backTrace } = this.props;
        navigate( backTrace[backTrace.length-2].page, { backTrace: backTrace.filter( x => x.value != backTrace[backTrace.length-1].value && x.value != backTrace[backTrace.length-2].value), filter: backTrace[backTrace.length-2].filter });
    };

  render () {
    const { navigate, messages, upvote, downvote, filter, backTrace } = this.props;
    const { height, width } = this.state;
    return (
        <div>
            <div style={{position:"fixed", float:"left", width:"100%", marginTop:"-50px"}}>
              <Button variant="dark" size="lg" onClick={() => this.handleBack()} fixed="top">Back</Button>
              <h1 style={{textAlign:"center", marginTop: "-50px"}}>{filter.label}</h1>
            </div>
            <div style={{marginTop: "50px"}}>
              <Feed
                  backTrace={backTrace}
                  filter={filter}
                  messages={messages}
                  navigate={navigate}
                  upvote={upvote}
                  downvote={downvote}
              />
            </div>
        </div>
    );
  }
}