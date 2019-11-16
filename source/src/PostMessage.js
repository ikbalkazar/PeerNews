import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

export default class PostMessage extends React.Component {

	constructor(props) {
    	super(props);
    
    	this.state = { value: 'select'};
	}

  	render () {

    const styles = {

    	inputStyle:{
    		fontSize: 20,
    		fontWeight: 'bold',
    		color: 'blue',
  		},
  		
  		textArea:{
  			width: '800px', 
  			height: '250px',
  		},

  		buttonStyle:{
  			position: 'absolute',
  			left: '43%',
  		},

  		select: {
   			border: 0,
   			color: '',
   			background: 'transparent',
   			fontSize: '15px',
   			fontWeight: 'bold',
   			width: '200px',
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
   			shadowOffset: {widht:1, height: 1},
   			shadowRadius: '20px',
   			shadowColor: '#330033',
   			//background: #58B14C url("http://i62.tinypic.com/15xvbd5.png") no-repeat scroll 319px center;
		}

    }

    return (

    	<div style={ styles.div } >
        <form action="/action_page.php">
 			<div class="form-group">
    			<input type="text" class="form-control" id="title" placeholder="Enter Your Title Here.." style={styles.inputStyle} ></input>
  			</div>
  			<div class="form-group">
    			<textarea type="text" class="form-control" id="message" placeholder="Enter your text message here.." style={styles.textArea}>
    			</textarea>
  			</div>
  			<Button variant="success" size="lg" type="submit" style={styles.buttonStyle} >Submit</Button>
		</form>

        <Select value={this.state.selected} options={options} onChange={this.onChange}/>

	</div>
    );
  }
}

const options = ["Select an Option", "First Option", "Second Option", "Third Option"]