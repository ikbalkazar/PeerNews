import React from 'react';
import ReactPlayer from 'react-player'

export default ({mediaURL}) => {
  if (ReactPlayer.canPlay(mediaURL)) {
    return (
      <ReactPlayer url={mediaURL} playing={false} loop={true} volume={0} controls={true} width="598px" height="337px"/>
    );
  }
  return (
    <img src={mediaURL} style={{width: '100%', maxWidth: 600}}/>
  );
};