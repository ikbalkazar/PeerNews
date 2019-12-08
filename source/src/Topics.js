import React from 'react';
import { ROUTES } from './util';
import MessageCard from './MessageCard';
import Card from "react-bootstrap/Card";
import Image from 'react-image-resizer';
import { Link, animeteScroll as scroll } from 'react-scroll';
import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

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
  },

  root: {
      backgroundColor: 'BLUE',
      backgroundSize: "100% 100%",
      marginBottom: "20px",
      paddingTop: "30px",
      paddingBottom: "10px",
      paddingLeft: "50px",
      marginLeft:"25%",
      width:"50%",
      opacity: '1'
  },

  formControl: {
  },

}

export default class Topics extends React.Component {

  constructor(props) {
      super(props);
      this.state = { height:"", width:""  };
  }

  handleClick = (topic) => {
    const { navigate, backTrace } = this.props;
    navigate(ROUTES.TopicPage, { filter: topic, backTrace: backTrace });
  };

  unfollowTopic = ( label ) => {
    this.props.handleChangeTopic( label, false );
  };

  followTopic = ( label ) => {
    this.props.handleChangeTopic( label, true );
  };

  render () {
    const { topicsList } = this.props;
    const { height, width } = this.state;
    return (
      <div>
          {topicsList.map(topic => 
            <div style={styles.root}>
              <div style={{opacity: '1.0', marginLeft: topic.marginLeft, width:"50%",
                    color:topic.color, fontSize:"50px", fontFamily:"Allan", fontStyle:"italic", cursor:"pointer"}} onClick={() => this.handleClick(topic)}>
                  {topic.label}
              </div>
                <div style={{opacity: '1.0', marginLeft:"43%", marginTop: "5%", width:"50%"}}>
                    {
                        topic.value === true ?
                            <button style={{fontSize: "15px"}} onClick={() => this.unfollowTopic(topic.label)}>unfollow</button>
                            :
                            <button style={{fontSize: "15px"}} onClick={() => this.followTopic(topic.label)}>follow</button>
                    }
                </div>
            </div>
          )}
      </div>
    );
  }
}