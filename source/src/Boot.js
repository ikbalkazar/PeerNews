import React from 'react';
import ConfigStore from './ConfigStore';
import { createSender, deserializeSender, serializeSender } from './message';
import App from './app';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MediaUploader from './MediaUploader';
import {
  encodeBase64,
} from 'tweetnacl-util';

const styles = {
  divMiddle: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundImage: 'url(../assets/login2.jpg)',
        backgroundSize: 'cover',
        float: 'left',
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

class Username extends React.Component {
  state = {
    username: '',
    privateKey: '',
    open: false,
    media: '',
  };

  handleMediaFilePath = (media) => {
    this.setState({ media });
  };

  handleMediaImport = () => {
    this.props.onImportFile(this.state.media);
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ username: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { username } = this.state;
    const { onSubmit } = this.props;
    if (username.length > 3) {
      onSubmit(username);
    }
  };

  onExistingSubmit = (event) => {
    event.preventDefault();
  };

  handleOpen = () => {
    this.setState({open:true});
  };
  handleClose = () => {
    event.preventDefault();
    this.setState({open:false});
  };

  render() {
    const { username, open, existingOpen, media } = this.state;
    return (
        <div style={styles.divMiddle}>
          <div style={{fontSize:"120px", fontFamily:"Times New Roman", fontStyle:"italic", paddingTop: 50, textAlign:"center", color:"white"}}>PeerNews</div>
          <div style={{paddingTop: 50, width:"45%", float:"left", color:"transparent"}}> </div>
          <div style={{paddingTop: 50, width:"10%", float:"left", color:"white"}}>
          <h2 style={{textAlign:"center", color:"white", cursor:"pointer", border: '1px solid white' }} onClick={this.handleOpen}>Join Now</h2>
          </div>
          <div style={{paddingTop: 50,width:"45%", float:"right", color:"white"}}> </div>
          <Dialog open={open} onClose={this.handleClose} maxWidth="md" fullWidth="true" aria-labelledby="max-width-dialog-title">
            <DialogContent>
              <DialogContentText style={{textAlign:"center"}}>
                <b>Just username is enough to join our society !!!!</b>
              </DialogContentText>
              <Form style={{padding: 0, width: 900}}>
                <Form.Group>
                  <Form.Control type="text" placeholder="Username" value={username} onChange={this.handleChange} />
                </Form.Group>
                <MediaUploader
                  media={media}
                  onSubmit={this.handleMediaImport}
                  onChange={this.handleMediaFilePath}
                  buttonTitle="Have an existing account?"
                  header="Import config file"
                />
                <Button variant="success" style={{marginTop:"-7%", marginLeft:"48%"}} type="submit" onClick={this.onSubmit}>
                  Join
                </Button>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
    );
  }
}

class DisplayKeys extends React.Component {
  render() {
    const { keyPair, onNext } = this.props;
    const { privateKey, publicKey } = keyPair;
    return (
      <div style={{textAlign: 'center', padding: 20}}>
        <h4>Take a note of your keys!</h4>
        <h5>Private Key</h5>
        <p>{encodeBase64(privateKey)}</p>
        <h5>Public Key</h5>
        <p>{encodeBase64(publicKey)}</p>
        <Button
          variant="primary"
          type="submit"
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    );
  }
}

export default class Boot extends React.Component {
  constructor(props) {
    super(props);
    this.configStore = new ConfigStore();
    this.state = {
      sender: null, // TODO: set to sender and add logout functionality
      tempSender: null,
      username: null,
      storeLoading: true,
    };
    this.loadConfigStore();
  }

  loadConfigStore = async () => {
    await this.configStore.load();
    this.setState({
      storeLoading: false,
      sender: deserializeSender(this.configStore.get('sender')),
    });
  };

  onSubmitUsername = (username) => {
    this.setState({ username });
    const sender = createSender(username);
    this.configStore.set('sender', serializeSender(sender));
    this.setState({ tempSender: sender });
  };

  onFinish = () => {
    const { tempSender } = this.state;
    this.setState({ sender: tempSender });
  };

  onImportFile = async (path) => {
    await this.configStore.importFile( path );
    const sender = deserializeSender(this.configStore.get('sender'));
    this.setState({ tempSender: sender });
    this.onFinish();
  };

  onLogout = () => {
    this.configStore.set('sender', null);
    this.setState({ sender: null, tempSender: null, username: null });
  };

  render() {
    const { sender, tempSender, username, storeLoading } = this.state;
    if (storeLoading) {
      return null;
    }
    if (sender !== null) {
      return <App sender={sender} configStore={this.configStore} onLogout={this.onLogout}/>;
    } else {
      if (!username) {
        return <Username onSubmit={this.onSubmitUsername} onImportFile={this.onImportFile}/>;
      } else {
        return <DisplayKeys keyPair={tempSender.keyPair} onNext={this.onFinish}/>;
      }
    }
  }
}