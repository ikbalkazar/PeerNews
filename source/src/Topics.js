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
import Button from 'react-bootstrap/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Form from 'react-bootstrap/Form';

const styles = {

  buttonDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

}

export default class Topics extends React.Component {

  constructor(props) {
      super(props);
      this.state = { height:"", width:"", informationBoxCases:[]  };
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

  getTotalPostOfTopic = (topic) => {
    const result = this.props.getTotalPostOfTopic(topic);
    return result;
  };
  getTotalCommentOfTopic = (topic) => {
    const result = this.props.getTotalCommentOfTopic(topic);
    return result;
  };
  getTotalUpVotesOfTopic = (topic) => {
    const result = this.props.getTotalUpVotesOfTopic(topic);
    return result;
  };
  getTotalDownVotesOfTopic = (topic) => {
    const result = this.props.getTotalDownVotesOfTopic(topic);
    return result;
  };
  handleClose = ( topic ) => {
    let topics = this.state.informationBoxCases;
    for( var i = 0 ; i < topics.length ; i++ )
      if( topics[i].label === topic.label )
        topics[i].value = false;
    this.setState( { informationBoxCases: topics } );
  };
  handleOpen = ( topic ) => {
    let topics = this.state.informationBoxCases;
    for( var i = 0 ; i < topics.length ; i++ )
      if( topics[i].label === topic.label )
        topics[i].value = true;
    this.setState( { informationBoxCases: topics } );
  };
  check = ( topic ) => {
    return this.state.informationBoxCases.filter( x => x.label === topic.label )[0].value;
  };

  render () {
    const { topicsList } = this.props;
    const { height, width, informationBoxCases } = this.state;
    for( var i = 0 ; i < topicsList.length ; i++ )
      informationBoxCases.push( {label: topicsList[i].label, value:false, id: i} );

    let borderString = "";
    if( this.props.theme.borderColor !== "" )
      borderString = "2px solid " + this.props.theme.borderColor;

    const root = {
      //backgroundColor: "#cdc9cd",
      backgroundColor: this.props.theme.topicColor,
      marginBottom: "20px",
      marginLeft:"auto",
      marginRight:"auto",
      width:"600px",
      heigth: "auto",
      opacity: '1',
      borderRadius: "15px 50px",
      border: borderString
    }

    return (
      <div style={{backgroundColor:this.props.theme.backgroundColor, marginTop:"2px"}}>
          {topicsList.map(topic => 
            <div style={root}>
              <div style={{opacity: '1.0', textAlign:"center",
                    color:topic.color, fontSize:"50px", fontFamily:"Allan", fontStyle:"italic", cursor:"pointer"}} onClick={() => this.handleClick(topic)}>
                  {topic.label}
              </div>
              <div style={{opacity: '1.0', fontSize:"15px", fontFamily:"Allan", fontStyle:"italic", cursor:"pointer", display: "flex", alignItems: "center", justifyContent: "center" }} >
                <Dialog open={this.check(topic)} onClose={() => this.handleClose(topic)} maxWidth="sm" fullWidth="true" aria-labelledby="max-width-dialog-title">
                  <DialogContent>
                    <DialogContentText style={{textAlign:"center"}}>
                      <p><b>Statistical information of "{topic.label}":</b></p>
                      <p> Total post Count : {this.getTotalPostOfTopic(topic)} </p>
                      <p> Total comment Count : {this.getTotalCommentOfTopic(topic)} </p>
                      <p> Total upvote Count : {this.getTotalUpVotesOfTopic(topic)} </p>
                      <p> Total downvote Count : {this.getTotalDownVotesOfTopic(topic)} </p>
                    </DialogContentText>
                  </DialogContent>
                    <Button variant="danger" onClick={() => this.handleClose(topic)}>
                      Close
                    </Button>
                </Dialog>
              </div>
              <div style={styles.buttonDiv}>
                  <Button variant="outline-info" style={{marginBottom:"5px"}} color="primary" onClick={() => this.handleOpen(topic)}>
                    Information
                  </Button>
                  {
                    topic.value === true ?
                        <Button variant="outline-danger" style={{fontSize: "15px", marginLeft:"10px", marginBottom:"5px", left:"auto", right:"auto" }} onClick={() => this.unfollowTopic(topic.label)}>unfollow</Button>
                        :
                        <Button variant="outline-success" style={{fontSize: "15px", marginLeft:"10px", marginBottom:"5px", left:"auto", right:"auto"}} onClick={() => this.followTopic(topic.label)}>follow</Button>
                  }
              </div>
            </div>
          )}
      </div>
    );
  }
}