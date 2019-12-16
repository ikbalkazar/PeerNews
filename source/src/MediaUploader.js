import React from 'react';
import MediaViewer from './MediaViewer';
import { remote } from 'electron';
import { readFile, stableMediaFilename, writeAppFile } from './fsutils';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonPreview: {
    textAlign: 'center',
    margin: 30,
  },
  attach: {
    marginTop: 15,
  }
};

export default class MediaUploader extends React.Component {
  state = {
    open: false,
  };

  startChooseFile = async (event) => {
    const { isDirectory } = this.props;
    event.preventDefault();
    const { onChange } = this.props;
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: [isDirectory ? 'openDirectory' : 'openFile']
    });
    if (!canceled && filePaths.length > 0) {
      onChange(filePaths[0]);
    }
  };

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  handleClose = (event) => {
    event.preventDefault();
    this.setState({ open: false });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({
      open: false,
    });
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  onOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { open } = this.state;
    const { media, showPreview, buttonTitle, header } = this.props;
    return (
      <div>
        <Button variant="outline-success" style={styles.attach} color="primary" onClick={this.onOpen}>
          {buttonTitle}
        </Button>
        {media && showPreview &&
          <div style={styles.buttonPreview}>
            <MediaViewer mediaURL={media}/>
          </div>
        }
        <Dialog open={open} onClose={this.handleClose} maxWidth="md" fullWidth="true" aria-labelledby="max-width-dialog-title">
          <DialogContent>
            <DialogContentText style={{textAlign:"center"}}>
              <b>{header}</b>
            </DialogContentText>
            {showPreview &&
              <DialogContentText style={{textAlign:"center"}}>
                <MediaViewer mediaURL={media}/>
              </DialogContentText>
            }
            <Form style={{padding: 20, width: 900}}>
              <Form.Group>
                <div style={styles.wrapper}>
                  <Form.Control type="text" placeholder="Enter link" value={media} onChange={this.handleChange} />
                  <Button variant="success" style={{marginLeft:"50px", width: '200px'}} type="submit" onClick={this.startChooseFile}>
                    Choose File
                  </Button>
                </div>
              </Form.Group>
              <Button variant="danger" style={{marginLeft:"10px"}} type="submit" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="success" style={{marginLeft:"705px"}} type="submit" onClick={this.onSubmit}>
                Done
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};