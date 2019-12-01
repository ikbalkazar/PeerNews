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

export default class TopicPage extends React.Component {

  constructor(props) {
      super(props);
      this.state = { height:"", width:""  };
  };

    handleBack = () => {
        const { navigate } = this.props;
        if( typeof this.props.previousFilter === "undefined" )
            navigate(this.props.previousPage, {});
        else
            navigate(this.props.previousPage, { previousPage:ROUTES.TopicPage, filter: this.props.previousFilter });
    };

  render () {
    const { navigate, messages, upvote, downvote, filter } = this.props;
    const { height, width } = this.state;
    return (
        <div>
            <Button variant="dark" size="lg" onClick={() => this.handleBack()}>Back</Button>
            <h1 style={{marginLeft: filter.wholePageMargin, marginTop: "-50px"}}>{filter.label}</h1>
            <Feed
                filter={filter}
                source={ROUTES.TopicPage}
                messages={messages}
                navigate={navigate}
                upvote={upvote}
                downvote={downvote}
            />
        </div>
    );
  }
}