import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MediaUploader from './MediaUploader';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { isHttpUrl } from './util';

const topics = [
	{label: "children", value: "children", valuestring: "Followed", color: "GREEN", marginLeft: "37%"},
	{label: "comics", value: "comics", valueString: "Unfollowed", color: "RED", marginLeft: "39%"},
	{label: "commerce", value: "commerce", valueString: "Unfollowed", color: "RED", marginLeft: "37%"},
	{label: "crypto currency", value: "crypto currency", valueString: "Unfollowed", color: "RED", marginLeft: "31%"},
	{label: "culture", value: "culture", valueString: "Unfollowed", color : "RED", marginLeft: "38%"},
	{label: "food", value: "food", valueString: "Unfollowed", color: "RED", marginLeft: "41%"},
	{label: "football", value: "football", valuestring: "Followed", color: "GREEN", marginLeft: "37%"},
	{label: "game", value: "game", valueString: "Unfollowed", color: "RED", marginLeft: "41%"},
	{label: "movies", value: "movies", valueString: "Unfollowed", color: "RED", marginLeft: "39%"},
	{label: "travel", value: "travel", valueString: "Unfollowed", color: "RED", marginLeft: "39%"}
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

  	selectArea: {
   		border: 0,
   		color: '',
   		background: 'transparent',
   		fontSize: '15px',
   		fontWeight: 'bold',
   		width: '100px',
   		maxMenuHeight: 5,
	},


	fileInput: {
		borderRadius: '5px',
		border: '1px solid lightgray',
		padding: '10px',
		//margin: '15px',
		cursor: 'pointer',
	},

	imgPreview: {
		borderRadius: '5px',
		border: '1px solid lightgray',
		height: '200px',
		width: '350px',
		//margin: '5px 15px',
		img: {
			width: '100%',
			height: '100%',
		},
	},

	previewText: {
		width: '100%',
		margin: '20px',
	},

	imageSubmitButton: {
		borderRadius: '3px',
		padding: '12px',
		margin: '10px',
		background: 'white',
		border: '1px solid lightgray',
		cursor: 'pointer',
	},

	div: {
    	width: 700,
		  marginTop: 50,
			marginLeft: 'auto',
		  marginRight: 'auto',
   		borderRadius: '9px',
   		borderRadiusInputTopLeft: '9px',
      	borderRadiusInputTopRight: '9px',
      	borderRadiusInputBottomLeft: '9px',
     	borderRadiusInputBottomRight: '9px',
   		shadowOffset: {widht:2, height: 2},
   		shadowRadius: '20px',
   		shadowColor: '#330033',
		//background: #58B14C url("http://i62.tinypic.com/15xvbd5.png") no-repeat scroll 319px center;
	}

}


export default class PostMessage extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		text:"", title:"", image:"", video:"", selectedOptions: [],
				loading: false, file: "", imagePreviewUrl: "", media: "",
    	};
	}

	handleText = event => {
		event.preventDefault();
		this.setState({ text: event.target.value });
	};

	handleVideo = event => {
		event.preventDefault();
		this.setState({ video: event.target.value });
	};

	handleImageChange = event => {
		event.preventDefault();
		console.log(event.target.value);
		this.setState({ image: event.target.value });
	};

	handleImageSubmit = event => {
		event.preventDefault();
		// TODO: do something with -> this.state.file
		console.log('handle uploading-', this.state.file);
	};

	handleTitle = event =>{
		event.preventDefault();
		this.setState({ title: event.target.value });
	};

	onSubmit = async (event) => {
		event.preventDefault();
		const { text, media, title, selectedOptions } = this.state;
		const { seedAsTorrent } = this.props;
		const topics = selectedOptions.map( x => x.label );
		if (title.length > 0 && topics.length > 0) {
				this.setState({ loading: true });
				if ( media === "" || media === null ){
					this.postPreparedMessage(title, "", text, topics);
				}
				else if (isHttpUrl(media)) {
					this.postPreparedMessage(title, media, text, topics);
				} else {
					seedAsTorrent(media, (magnetURI) => {
						this.postPreparedMessage(title, magnetURI, text, topics);
					});
				}
		}
	};

	postPreparedMessage = (title, media, text, topics) => {
    const { postMessage } = this.props;
    setTimeout(() => {
      postMessage(title, media, text, topics);
      this.setState({ text: '', title:'', media:'', selectedOptions: [], loading: false });
    }, 0);
	};

	onChange = (event) =>{
		console.log(JSON.stringify(event));
		this.setState( { selectedOptions: event }  );
	};

	handleMediaFilePath = (media) => {
		this.setState({ media });
	};

	render () {
		const {text, title, loading, media} = this.state;

		return (
			<div style={ styles.div } >
				<div className="form-group">
					<input type="text" className="form-control" id="title" placeholder="Enter Your Title Here.." style={styles.inputStyle} value={title} onChange={this.handleTitle} ></input>
					<MediaUploader
						media={media}
						onChange={this.handleMediaFilePath}
						buttonTitle="Attach Media"
						header="Upload a file or enter a video/image link"
						showPreview
					/>
				</div>
				<div className="form-group">
					<textarea type="text" className="form-control" id="message" placeholder="Enter your text message here.." style={styles.textArea} value={text} onChange={this.handleText}>
					</textarea>
				</div>
				<Select value={this.state.selectedOptions} placeholder="Select topics from below" isMulti options={topics} style={styles.selectArea} onChange={this.onChange}></Select>
				<div style={{textAlign: 'center', marginTop: 100}}>
					<Button variant="success" size="lg" type="submit" onClick={this.onSubmit} disabled={loading}>
						{loading ? 'Submitting...' : 'Submit'}
					</Button>
				</div>
			</div>
		);
  }
}