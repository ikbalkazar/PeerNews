import React from 'react';
import { ROUTES } from './util';
import { serializeSender } from './message';

import {
  AlphaPicker,
  BlockPicker,
  ChromePicker,
  CirclePicker,
  CompactPicker,
  GithubPicker, HuePicker, MaterialPicker, PhotoshopPicker,
  SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker
} from 'react-color';

import Button from "react-bootstrap/Button";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import ListGroup from 'react-bootstrap/ListGroup'
import Popover from 'react-bootstrap/Popover'
import Alert from 'react-bootstrap/Alert'

export default class Profile extends React.Component {



  constructor(props) {
      super(props);
  }

  getTotalPostOfUser = (user) => {
    const result = this.props.getTotalPostOfUser(user);
    return result;
  };
  getTotalCommentOfUser = (user) => {
    const result = this.props.getTotalCommentOfUser(user);
    return result;
  };
  getTotalUpVotesOfUser = (user) => {
    const result = this.props.getTotalUpVotesOfUser(user);
    return result;
  };
  getTotalDownVotesOfUser = (user) => {
    const result = this.props.getTotalDownVotesOfUser(user);
    return result;
  };

  handleChangeComplete = (color) => {
    this.props.changeBackgroundColor( color.hex );
  };

  onExport = event => {
    event.preventDefault();
    console.log('Exported');
  };

  renderTooltip(props) {
      return <Tooltip show="true" {...props}>You should export your profile to save your configurations so that you can load them when you come back !</Tooltip>;
  };

  onClickUser( user ){
    console.log('user clicked');
    console.log(user);
    this.props.navigate(ROUTES.UserPostPage, { oldFilter:this.props.filter, filter: user, backTrace: this.props.backTrace });
  };

  onClickTopic( topic ){
    console.log('topic clicked');
    console.log(topic.label);
    this.props.navigate(ROUTES.TopicPage, { filter: topic, backTrace: this.props.backTrace });
  };

  onClickDisplayKey = ( key ) => {
      return (
            <Popover id="popover-basic" onClick={() => {navigator.clipboard.writeText(key)}} style={{cursor:'pointer'}} >
              <Popover.Title as="h3">Click to copy</Popover.Title>
              <Popover.Content>
                <b> {key} </b>
              </Popover.Content>
            </Popover>
          )
  };

  changeTheme = ( theme ) => {

    console.log('theme changed' + theme);

  };

  render () {
    const color = this.props.theme.backgroundColor;
    const list = ['element1', 'hello2', 'abc3'];
    const followedUsers = this.props.users;
    const followedTopics = this.props.topics.filter( item => (item.value === true ) );
    const user = serializeSender( this.props.myself );

    console.log(followedUsers);
    console.log(followedTopics);
    console.log(user);
    console.log(color);

    const numberOfPosts = this.getTotalPostOfUser(user);
    const numberOfUpvotes = this.getTotalUpVotesOfUser(user);
    const numberOfDownvotes = this.getTotalDownVotesOfUser(user);

    return (

      <div style={{ position: 'absolute', overflowY:'auto', top:0, left:0 ,width: '100%', height: '100%', backgroundColor:color, color:this.props.theme.textColor}}>

        <div style={{position: 'absolute',left: '20%' , transform: 'translateX(-50%)', borderRadius: '15px' ,borderStyle: 'solid', borderWidth: '3px', borderColor: 'lightgray',  width: '25%' , height: '500px', marginTop: '100px' }}>
          <h3 style={{textAlign: 'center',marginTop:'5%'}}> Customize Your Background Color</h3>
          <div style={{position: 'absolute',left: '50%' , transform: 'translateX(-50%)'}}>
            <SketchPicker
                 color={ color }
                 onChangeComplete={ this.handleChangeComplete }
            />
          </div>

          <div style={{position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'236px' , height:'18%' , bottom:'0px'}}>
            <h5 style={{textAlign: 'center'}}>Change Your Theme</h5>
            <Button style={{position:'absolute', left:'0%', bottom:0}} variant="outline-info"  onClick={() => this.changeTheme('light')}>Light Theme</Button>
            <Button style={{position:'absolute', right:'0%', bottom:0}}variant="outline-dark"  onClick={() => this.changeTheme('dark')}>Dark Theme</Button>
          </div>

        </div>


        <div style={{position: 'absolute', left: '50%' , transform: 'translateX(-50%)', borderRadius: '15px' ,borderStyle: 'solid', borderWidth: '3px', borderColor: 'lightgray',  width: '25%' , height: '500px', marginTop: '100px' }}>
          <h3 style={{textAlign: 'center',marginTop:'5%'}}> Followed Users </h3>
          <ListGroup style={{overflowY: 'scroll', position:'absolute' , top:'70px' , bottom:'0px' , left:'0px' ,right:'0px'}} >
           {
             followedUsers.map(item => (
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 800 }} overlay={this.onClickDisplayKey(item.id)}>
                  <ListGroup.Item style={{cursor:'pointer', backgroundColor:this.props.theme.backgroundColor, borderColor:this.props.theme.borderColor}}
                   onClick={() => this.onClickUser(item.id)}>{item.name} @ <i>{item.id.substring(0,15)}</i>...</ListGroup.Item>
                </OverlayTrigger>
                ))
           }
          </ListGroup>
        </div>

        <div style={{position: 'absolute', left: '80%' , transform: 'translateX(-50%)',borderRadius: '15px' ,borderStyle: 'solid', borderWidth: '3px', borderColor: 'lightgray',  width: '25%' ,height: '500px', marginTop: '100px' }}>
          <h3 style={{textAlign: 'center',marginTop:'5%'}}> Followed Topics </h3>
           <ListGroup style={{overflowY: 'scroll', position:'absolute' , top:'70px' , bottom:'0px' , left:'0px' ,right:'0px'}}>
           {
             followedTopics.map(item => ( <ListGroup.Item style={{cursor:'pointer',backgroundColor:this.props.theme.backgroundColor, borderColor:this.props.theme.borderColor}} onClick={() => this.onClickTopic(item)}>{item.label}</ListGroup.Item>))
           }
          </ListGroup>
        </div>

        <div style={{ position: 'absolute', minWidth:'1000px' ,left: '50%' , transform: 'translateX(-50%)', borderRadius: '15px', borderStyle: 'solid' , borderWidth: '0px' , borderColor:'black' , width: '85%' , height:'300px' , marginLeft:'auto' , marginRight:'auto' , marginTop:'650px'}}>

                            <div style={{ position:'absolute', minWidth:'500px' ,left: '10%' , top:'25%', transform: 'translateX(-50,-50)', borderRadius: '15px' ,borderStyle: 'solid', borderWidth: '0px', borderColor: 'lightgray',  width: '40%' ,height: '50%'}}>
                              <OverlayTrigger trigger="click" placement="top" overlay={this.onClickDisplayKey(user.keyPair.publicKey)}>
                                <Button style={{position:'absolute', left:'0px'}} variant="success" size="lg">What is my Public Key?</Button>
                              </OverlayTrigger>

                              <OverlayTrigger trigger="click" placement="top" overlay={this.onClickDisplayKey(user.keyPair.privateKey)}>
                                <Button style={{position:'absolute', right:'0px'}} variant="success" size="lg">What is my Private Key?</Button>
                              </OverlayTrigger>

                              <div style={{position:'absolute',bottom:'0px', width:'100%'}}>
                                <OverlayTrigger placement="right" delay={{ show: 250, hide: 500 }} overlay={this.renderTooltip}>
                                  <Button variant="outline-primary" size="lg" color="primary" onClick={() => this.onExport} block>
                                    Export Your Profile
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </div>

                            <div style={{ position: 'absolute', left: '60%' , top:'10%', transform: 'translateX(-50,-50)', borderRadius: '15px' ,borderStyle: 'solid', borderWidth: '3px', borderColor: 'lightgray',  width: '30%' ,height: '80%'}}>
                               <h2 style={{textAlign:'center'}}>Your Statistics</h2>
                               <Alert variant='dark'>
                                 Post Entries: {numberOfPosts}
                               </Alert>
                               <Alert variant='success'>
                                 Upvotes: {numberOfUpvotes}
                               </Alert>
                               <Alert variant='danger'>
                                 Downvotes: {numberOfDownvotes}
                               </Alert>
                            </div>
        </div>




      </div>

    );
  }
}