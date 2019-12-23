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
	{label: "Advertisement", value: "Advertisement", color: "GREEN"},
	{label: "Aliens", value: "Aliens", color: "GREEN"},
	{label: "Animals", value: "Animals", color: "GREEN"},
	{label: "Art", value: "Art", color: "GREEN"},
	{label: "Books", value: "Books", color: "GREEN"},
	{label: "Celebrities", value: "Celebrities", color: "GREEN"},
	{label: "Charity", value: "Charity", color: "GREEN"},
	{label: "Children", value: "Children", color: "GREEN"},
	{label: "Creativity", value: "Creativity", color: "GREEN"},
	{label: "Corruption", value: "Corruption", color: "GREEN"},
	{label: "Culture", value: "Culture", color: "GREEN"},
	{label: "Dance", value: "Dance", color: "GREEN"},
	{label: "Education", value: "Education", color: "GREEN"},
	{label: "Fashion", value: "Fashion", color: "GREEN"},
	{label: "Friendship", value: "Friendship", color: "GREEN"},
	{label: "Fruit", value: "Fruit", color: "GREEN"},
	{label: "Food", value: "Food", color: "GREEN"},
	{label: "Future", value: "Future", color: "GREEN"},
	{label: "Games", value: "Games", color: "GREEN"},
	{label: "Happiness", value: "Happiness", color: "GREEN"},
	{label: "History", value: "History", color: "GREEN"},
	{label: "Hobbies", value: "Hobbies", color: "GREEN"},
	{label: "Holiday", value: "Holiday", color: "GREEN"},
	{label: "Humor", value: "Humor", color: "GREEN"},
	{label: "Internet", value: "Internet", color: "GREEN"},
	{label: "Job", value: "Job", color: "GREEN"},
	{label: "Movies", value: "Movies", color: "GREEN"},
	{label: "Music", value: "Music", color: "GREEN"},
	{label: "Nature", value: "Nature", color: "GREEN"},
	{label: "News", value: "News", color: "GREEN"},
	{label: "Photography", value: "Photography", color: "GREEN"},
	{label: "Podcasts", value: "Podcasts", color: "GREEN"},
	{label: "School", value: "School", color: "GREEN"},
	{label: "Space", value: "Space", color: "GREEN"},
	{label: "Sports", value: "Sports", color: "GREEN"},
	{label: "Social media", value: "Social media", color: "GREEN"},
	{label: "Talents", value: "Talents", color: "GREEN"},
	{label: "Travel", value: "Travel", color: "GREEN"},
	{label: "TV", value: "TV", color: "GREEN"},
	{label: "Virtual reality", value: "Virtual reality", color: "GREEN"},
]

const styles = {

    inputStyle:{
    	fontSize: 20,
    	fontWeight: 'bold',
    	color: 'blue'
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
   		background: 'transparent',
   		fontSize: '15px',
   		fontWeight: 'bold',
   		width: '100px',
   		maxMenuHeight: 5,
   		color: 'orange',
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
		const topics = selectedOptions.map( x => x );
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
		const div = {
		    position:'relative',
	    	width: 700,
			marginTop: '7%',
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
	   		backgroundColor: this.props.theme.insideColor,
	   		color: this.props.theme.optionColor,
	   		borderColor: this.props.theme.borderColor,
		}

		return (
		  <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'auto', backgroundColor:this.props.theme.backgroundColor}}>
			<div style={ div } >
				<h1 style={{textAlign:"center", marginTop: "0px"}}>Create a new post</h1>
				<div className="form-group">
					<input type="text" className="form-control" id="title" placeholder="Enter Your Title Here.." style={styles.inputStyle} value={title} onChange={this.handleTitle} ></input>
				</div>
				<div className="form-group">
					<textarea type="text" className="form-control" id="message" placeholder="Enter your text message here.." style={styles.textArea} value={text} onChange={this.handleText}>
					</textarea>
				</div>
				<Select value={this.state.selectedOptions} placeholder="Select topics from below" isMulti options={topics} style={styles.selectArea} onChange={this.onChange}></Select>
				<div style={{textAlign: 'center', marginTop: 20}}>
					<Button variant="success" size="lg" type="submit" onClick={this.onSubmit} disabled={loading}>
						{loading ? 'Posting...' : 'Post'}
					</Button>
				</div>
				<div style={{textAlign: 'left', marginTop: -53}}>
					<MediaUploader
						media={media}
						onChange={this.handleMediaFilePath}
						buttonTitle="Attach Media"
						header="Upload a file or enter a video/image link"
						showPreview
					/>
				</div>
			</div>
			</div>
		);
  }
}