import React from 'react';
import Button from "react-bootstrap/Button";

export default ({onBack, title, isRightOn, onRightOnClick, onRightOffClick, rightOnTitle, rightOffTitle}) => (
  <div style={{
    position:"fixed", width:"100%", marginTop:"-56px", zIndex: 11,
    backgroundColor: '#343a40',
    height: 53,
  }}>
    <Button variant="dark" size="lg" onClick={onBack}>{'Back'}</Button>
    <h4 style={{textAlign:"center", marginTop: "-40px", color: 'white'}}>
      {title}
    </h4>
    {
      (!isRightOn) ?
        <Button style={{position: 'absolute', right: 4, top: 7}} variant="success" size="md" onClick={onRightOnClick}>
          {rightOnTitle}
        </Button>
        :
        <Button style={{position: 'absolute', right: 4, top: 7}} variant="danger" size="md" onClick={onRightOffClick}>
          {rightOffTitle}
        </Button>
    }
  </div>
);