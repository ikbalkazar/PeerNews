import React from 'react';
import Card from 'react-bootstrap/Card';
import ReactPlayer from 'react-player'
import Button from 'react-bootstrap/Button';
import {ButtonToolbar} from 'react-bootstrap';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { Popover, OverlayTrigger, renderTooltip } from 'react-bootstrap';

const styles = {

  div: {
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
  },

  messageCard: {
        width: '40%',
        left: '30%',
        height: 'auto',
        cursor: 'pointer',
  },

  messageCardFocus: {
        width: '60%',
        left: '20%',
        height: 'auto',
        cursor: 'pointer',
  },

  goThumbsup: {
      marginLeft:"360px",
      marginBot:"0px",
  },

  goThumbsupFocus: {
      marginLeft:"590px",
      marginBot:"0px",
  },

  goThumbsdown: {
      marginLeft:"10px",
      marginBot:"0px",
  },

  goThumbsdownFocus: {
      marginLeft:"10px",
      marginBot:"0px",
  },

  commentNumber: {
      marginLeft:"10px",
      marginBot:"0px",
  },

  video: {
        width: '40%',
  },

  videoFocus: {
        width: '60%',
  },

  commentButton: {
      marginLeft: "10px",
  }

}

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Poster's public id</Popover.Title>
    <Popover.Content>
    //TO DO
    </Popover.Content>
  </Popover>
);

const shorten = (s) => {
  if (s.length < 100) {
    return s;
  }
  return s.substring(0, 100) + '...';
};

export default ({message, onClick, isPreview, commentHandler, upVote, downVote}) => {
  let aggregateVotes = 0;
  for (const vote of message.votes) {
    aggregateVotes += parseInt(vote.delta);
  }
  return (
    <div>
      {message.video === '' && message.image === '' ?
          <Card
            key={message.messageId}
            message={message}
            style={ isPreview ? styles.messageCard : styles.messageCardFocus }
          >
            {isPreview ? 
              <Card.Header onClick={onClick} style={{textAlign:'center'}}>{message.title}</Card.Header>
              :
              <Card.Header  style={{textAlign:'center'}}>{message.title}</Card.Header>
            }
            
            <Card.Body>
              {
                isPreview ?
                <Card.Text onClick={onClick}>
                  {isPreview ? shorten(message.text) : message.text}
                </Card.Text>
                :
                <Card.Text>
                  {isPreview ? shorten(message.text) : message.text}
                </Card.Text>
              }
              <blockquote className="blockquote mb-0">
              {
                isPreview ?
                  <footer className="blockquote-footer">
                    <OverlayTrigger
                      trigger="click" placement="bottom" overlay={popover}
                    >
                    <cite title="Source Title">{message.senderName} @{isPreview ? message.senderId.substring(0,10)+'...' : message.senderId.substring(0,10)+'...' }</cite>
                    </OverlayTrigger>
                    <GoThumbsup size={30} style={styles.goThumbsup} />
                    <b style={styles.commentNumber}> {aggregateVotes} </b>
                    <GoThumbsdown size={30} style={styles.goThumbsdown} />
                  </footer>
                :
                  <footer className="blockquote-footer">
                    <OverlayTrigger
                      trigger="click" placement="bottom" overlay={popover}
                    >
                    <cite title="Source Title">{message.senderName} @{isPreview ? message.senderId.substring(0,10)+'...' : message.senderId.substring(0,10)+'...' }</cite>
                    </OverlayTrigger>
                    <GoThumbsup size={30} style={styles.goThumbsupFocus} onClick={upVote} />
                    <b style={styles.commentNumber}> {aggregateVotes} </b>
                    <GoThumbsdown size={30} style={styles.goThumbsdownFocus} onClick={downVote} />
                    {
                      isPreview ?
                      ""
                      :
                      <Button variant="outline-success" style={styles.commentButton} color="primary" onClick={commentHandler}>
                        Make a comment
                      </Button>
                    }
                  </footer>
              }
              </blockquote>
              <ButtonToolbar>
                {message.topics.map( topic => 
                  <Button key="topic" style={{marginLeft:"5px", marginTop:"5px"}} variant="outline-success">{topic}</Button>
                )}
              </ButtonToolbar>
            </Card.Body>
          </Card>
        
          : message.video !== ''?

          <Card
            key={message.messageId}
            message={message}
            style={ isPreview ? styles.messageCard : styles.messageCardFocus }
          >
            {isPreview ? 
              <Card.Header onClick={onClick} style={{textAlign:'center'}}>{message.title}</Card.Header>
              :
              <Card.Header  style={{textAlign:'center'}}>{message.title}</Card.Header>
            }
            <ReactPlayer url={message.video} playing={false} loop={true} volume={0} controls={true} width="477.59" />
            <Card.Body>
              {
                isPreview ?
                <Card.Text onClick={onClick}>
                  {isPreview ? shorten(message.text) : message.text}
                </Card.Text>
                :
                <Card.Text>
                  {isPreview ? shorten(message.text) : message.text}
                </Card.Text>
              }    
              <blockquote className="blockquote mb-0">
              {
                isPreview ?
                  <footer className="blockquote-footer">
                    <OverlayTrigger
                      trigger="click" placement="bottom" overlay={popover}
                    >
                    <cite title="Source Title">{message.senderName} @{isPreview ? message.senderId.substring(0,10)+'...' : message.senderId.substring(0,10)+'...' }</cite>
                    </OverlayTrigger>
                    <GoThumbsup size={30} style={styles.goThumbsup} />
                    <b style={styles.commentNumber}> {aggregateVotes} </b>
                    <GoThumbsdown size={30} style={styles.goThumbsdown} />
                  </footer>
                :
                  <footer className="blockquote-footer">
                    <OverlayTrigger
                      trigger="click" placement="bottom" overlay={popover}
                    >
                    <cite title="Source Title">{message.senderName} @{isPreview ? message.senderId.substring(0,10)+'...' : message.senderId.substring(0,10)+'...' }</cite>
                    </OverlayTrigger>
                    <GoThumbsup size={30} style={styles.goThumbsupFocus} onClick={upVote} />
                    <b style={styles.commentNumber}> {aggregateVotes} </b>
                    <GoThumbsdown size={30} style={styles.goThumbsdownFocus} onClick={downVote} />
                    {
                      isPreview ?
                      ""
                      :
                      <Button variant="outline-success" style={styles.commentButton} color="primary" onClick={commentHandler}>
                        Make a comment
                      </Button>
                    }
                  </footer>
              }
              </blockquote>
              <ButtonToolbar>
                {message.topics.map( topic => 
                  <Button key="topic" style={{marginLeft:"5px", marginTop:"5px"}} variant="outline-success">{topic}</Button>
                )}
              </ButtonToolbar>
            </Card.Body>
          </Card>

          :  

          <Card
            key={message.messageId}
            message={message}
            style={ isPreview ? styles.messageCard : styles.messageCardFocus }
          >
            {isPreview ? 
              <Card.Header onClick={onClick} style={{textAlign:'center'}}>{message.title}</Card.Header>
              :
              <Card.Header  style={{textAlign:'center'}}>{message.title}</Card.Header>
            }
            <Card.Img variant="top" src={message.image} />
            <Card.Body>
              {
                isPreview ?
                <Card.Text onClick={onClick}>
                  {isPreview ? shorten(message.text) : message.text}
                </Card.Text>
                :
                <Card.Text>
                  {isPreview ? shorten(message.text) : message.text}
                </Card.Text>
              }
              <blockquote className="blockquote mb-0">
              {
                isPreview ?
                  <footer className="blockquote-footer">
                    <OverlayTrigger
                      trigger="click" placement="bottom" overlay={popover}
                    >
                    <OverlayTrigger
                      trigger="click" placement="bottom" overlay={popover}
                    >
                    <cite title="Source Title">{message.senderName} @{isPreview ? message.senderId.substring(0,10)+'...' : message.senderId.substring(0,10)+'...' }</cite>
                    </OverlayTrigger>
                    </OverlayTrigger>
                    <GoThumbsup size={30} style={styles.goThumbsup} />
                    <b style={styles.commentNumber}> {aggregateVotes} </b>
                    <GoThumbsdown size={30} style={styles.goThumbsdown} />
                  </footer>
                :
                  <footer className="blockquote-footer">
                    <cite title="Source Title">{message.senderName} @{isPreview ? message.senderId.substring(0,10)+'...' : message.senderId.substring(0,10)+'...' }</cite>
                    <GoThumbsup size={30} style={styles.goThumbsupFocus} onClick={upVote} />
                    <b style={styles.commentNumber}> {aggregateVotes} </b>
                    <GoThumbsdown size={30} style={styles.goThumbsdownFocus} onClick={downVote} />
                    {
                      isPreview ?
                      ""
                      :
                      <Button variant="outline-success" style={styles.commentButton} color="primary" onClick={commentHandler}>
                        Make a comment
                      </Button>
                    }
                  </footer>
              }
              </blockquote>
              <ButtonToolbar>
                {message.topics.map( topic => 
                  <Button key="topic" style={{marginLeft:"5px", marginTop:"5px"}} variant="outline-success">{topic}</Button>
                )}
              </ButtonToolbar>
            </Card.Body>
          </Card>
        }
      </div>
  );
};