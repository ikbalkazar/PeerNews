import React from 'react';
import { ROUTES } from './util';
import Card from "react-bootstrap/Card";
import Feed from './Feed';
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import Button from "react-bootstrap/Button";

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

export default class UserPostPage extends React.Component {

  constructor(props) {
      super(props);
      this.state = { height:"", width:""  };
  };

    handleBack = () => {
        const { navigate, backTrace } = this.props;
        navigate( backTrace[backTrace.length-2].page, { backTrace: backTrace.filter( x => x.value != backTrace[backTrace.length-1].value && x.value != backTrace[backTrace.length-2].value), filter: backTrace[backTrace.length-2].filter });
    };

  unfollowUser = () => {
    this.props.handleChangeUserInSinglePage( this.props.filter, false );
  };

  followUser = () => {
    this.props.handleChangeUserInSinglePage( this.props.filter, true );
  };

  render () {
    const { navigate, messages, upvote, downvote, filter, backTrace, searchResult } = this.props;
    const { height, width } = this.state;
    const color = searchResult === true ? "GREEN" : "RED";
    return (
        <div>
            <div style={{position:"fixed", width:"100%", marginTop:"-56px", zIndex: 11 }}>
              <Button variant="dark" size="lg" onClick={() => this.handleBack()}>Back</Button>
              <h1 style={{backgroundColor: color , textAlign:"center", marginTop: "-48px"}}>{messages[0].senderName}</h1>
              {
                searchResult === false ?
                  <Button style={{marginTop: "-90px", marginLeft: "95%"}} variant="success" size="lg" onClick={() => this.followUser()}>Follow</Button>
                  :
                  <Button style={{marginTop: "-90px", marginLeft: "94%"}} variant="danger" size="lg" onClick={() => this.unfollowUser()}>Unfollow</Button>
              }
            </div>
            <div style={{marginTop: "56px", zIndex:1 }}>
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