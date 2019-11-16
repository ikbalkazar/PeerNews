import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

const topics = [
	{label: "football", value: "football"},
	{label: "culture", value: "culture"},
	{label: "game", value: "game"},
	{label: "comics", value: "comics"},
	{label: "movies", value: "movies"},
	{label: "movies", value: "movies"},
	{label: "movies", value: "movies"},
	{label: "movies", value: "movies"},
	{label: "movies", value: "movies"},
	{label: "commerce", value: "commerce"}
]

const styles = {

    inputStyle:{
    	fontSize: 20,
    	fontWeight: 'bold',
    	color: 'blue',
  	},

  	contentStyle:{
    	fontSize: 14,
    	color: 'black',
  	},
  		
  	textArea:{
  		width: '700px', 
  		height: '300px',
  	},

  	buttonStyle:{
  		position: 'absolute',
  		left: '45%',
  		top: '102%',
  	},

  	selectArea: {
   		border: 0,
   		color: '',
   		background: 'transparent',
   		fontSize: '15px',
   		fontWeight: 'bold',
   		width: '100px',
   		maxMenuHeight: 5,
	},

	div: {
       	position: 'absolute', 
       	left: '50%', 
       	top: '50%',
       	transform: 'translate(-50%, -50%)',
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
	}

}


export default class PostMessage extends React.Component {

	constructor(props) {
    	super(props);
    
    	this.state = { text:"", title:"", image:"", video:"", selectedOptions: [] };
	}

	handleText = event => {
    	event.preventDefault();
    	this.setState({ text: event.target.value });
  	};

	handleVideo = event => {
    	event.preventDefault();
    	this.setState({ video: event.target.value });
  	};

  	handleImage = event => {
    	event.preventDefault();
    	this.setState({ image: event.target.value });
  	};

  	handleTitle = event =>{
  		event.preventDefault();
  		this.setState({ title: event.target.value });
  	};

	onSubmit = (event) => {
    	event.preventDefault();
    	const { text, selectedOptions } = this.state;
    	const { postMessage } = this.props;
    	const topics = selectedOptions.map( x => x.label );
    	if (text.length > 0 && topics.length > 0 ) {
      		postMessage(title, video, image, text, topics);
      		this.setState({ message: '', title:'', image:'', video:'', selectedOptions: [] });
    	}
  	};

  	onChange = (event) =>{
  		console.log(JSON.stringify(event));
  		this.setState( { selectedOptions: event }  );
  	};



  	render () {
    const {image, video, text, title} = this.state;

    return (

    	<div style={ styles.div } >
        <Form>
 			<div className="form-group">
    			<input type="text" className="form-control" id="title" placeholder="Enter Your Title Here.." style={styles.inputStyle} value={title} onChange={this.handleTitle} ></input>
    			<input type="text" className="form-control" id="title" placeholder="Video Url Here.." style={styles.contentStyle} value={video} onChange={this.handleVideo} ></input>
    			<input type="text" className="form-control" id="title" placeholder="Image Url Here.." style={styles.contentStyle} value={image} onChange={this.handleImage} ></input>
  			</div>
  			<div className="form-group">
    			<textarea type="text" className="form-control" id="message" placeholder="Enter your text message here.." style={styles.textArea} value={text} onChange={this.handleText}>
    			</textarea>
  			</div>

	        <Select value={this.state.selectedOptions} placeholder="Select topics from below" isMulti options={topics} style={styles.selectArea} onChange={this.onChange}></Select>

  			<Button variant="success" size="lg" type="submit" style={styles.buttonStyle} onClick={this.onSubmit}>Submit</Button>
		</Form>
		</div>
    );
  }
}