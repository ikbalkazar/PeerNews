import React from 'react';
import Feed from './Feed';
import StackedBar from './StackedBar';

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
    console.log( backTrace );
    return (
        <div>
            <StackedBar
              title={messages[0].senderName}
              onBack={this.props.backNavigation}
              isRightOn={searchResult}
              onRightOnClick={this.followUser}
              rightOnTitle="Follow"
              onRightOffClick={this.unfollowUser}
              rightOffTitle="Unfollow"
            />
            <div style={{marginTop: "54px", zIndex:1 }}>
              <Feed
                  backTrace={backTrace}
                  filter={filter}
                  messages={messages}
                  navigate={navigate}
                  upvote={upvote}
                  downvote={downvote}
                  controlVote={this.props.controlVote}
              />
            </div>
        </div>
    );
  }
}