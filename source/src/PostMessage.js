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
    
    	this.state = { selectedOptions: [] };
	}

	handleMessage = event => {
    	event.preventDefault();
    	this.setState({ message: event.target.value });
  	};

	onSubmit = (event) => {
    	event.preventDefault();
    	const { message } = this.state;
    	const { postMessage } = this.props;
    	if (message.length > 0) {
      		postMessage(message);
      		this.setState({ message: '' });
    	}
  	};

  	onChange = (event) =>{
  		console.log(JSON.stringify(event));
  		this.setState( { selectedOptions: event }  );
  	};



  	render () {

    return (

    	<div style={ styles.div } >
        <Form>
 			<div className="form-group">
    			<input type="text" className="form-control" id="title" placeholder="Enter Your Title Here.." style={styles.inputStyle} ></input>
  			</div>
  			<div className="form-group">
    			<textarea type="text" className="form-control" id="message" placeholder="Enter your text message here.." style={styles.textArea}>
    			</textarea>
  			</div>

	        <Select value={this.state.selectedOptions} placeholder="Select topics from below" isMulti options={topics} style={styles.selectArea} onChange={this.onChange}></Select>

  			<Button variant="success" size="lg" type="submit" style={styles.buttonStyle} onClick={this.onSubmit}>Submit</Button>
		</Form>
		</div>
    );
  }
}