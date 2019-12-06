import React from 'react';
import Button from "react-bootstrap/Button";

const capitalizeFirstLetter = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
};

export default ({onBack, title, noRight, isRightOn, onRightOnClick, onRightOffClick, rightOnTitle, rightOffTitle}) => (
  <div style={{
    position:"fixed", width:"100%", marginTop:"-54px", zIndex: 11,
    backgroundColor: '#e8e8e8',
    height: 53,
  }}>
    <Button variant="light" size="md" style={{marginLeft: 13, marginTop: 8}} onClick={onBack}>{'Back'}</Button>
    <h4 style={{textAlign:"center", marginTop: "-35px", fontWeight: 800}}>
      {capitalizeFirstLetter(title)}
    </h4>
    {!noRight && (
      (!isRightOn) ?
        <Button style={{position: 'absolute', right: 23, top: 7}} variant="success" size="md" onClick={onRightOnClick}>
          {rightOnTitle}
        </Button>
        :
        <Button style={{position: 'absolute', right: 23, top: 7}} variant="danger" size="md" onClick={onRightOffClick}>
          {rightOffTitle}
        </Button>
    )}
  </div>
);