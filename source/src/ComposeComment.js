import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const styles = {
  commentButton: {
    marginLeft: "880px",
    marginTop: "-55px",
  }
};

export default class ComposeComment extends React.Component {

  state = {
    comment: '',
    name: '',
    open : false,
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ comment: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({open:false});
    const { comment } = this.state;
    const { postComment } = this.props;
    if (comment.length > 0) {
      postComment(comment);
      this.setState({ comment: '' });
    }
  };

  handleOpen = () => {
    this.setState({open:true});
  };

  handleClose = () => {
    event.preventDefault();
    this.setState({open:false});
  };

  render() {
    const { comment, open } = this.state;
    return (
      <div>
        <Button variant="outline-success" style={styles.commentButton} color="primary" onClick={this.handleOpen}>
          Make a comment
        </Button>
        <Dialog open={open} onClose={this.handleClose} maxWidth="md" fullWidth="true" aria-labelledby="max-width-dialog-title">
          
        </Dialog>
      </div>
    );
  }
}
