import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge'
import Jumbotron from 'react-bootstrap/Jumbotron'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ProgressBar from 'react-bootstrap/ProgressBar'

export default class Connect extends React.Component {
  state = {
    requestSignal: null,
    responseSignal: null,
    initiatorSignal: null,
    requestResponseSignal: null,
    pageState: 0,
  };

  componentDidMount() {
    const { peerManager } = this.props;
    peerManager.initiateManually((signal) => {
      console.log(`[Connect] Created initiator offer: ${signal}`);
      this.setState({initiatorSignal: signal});
    });
  }

  changePageState = ( newState ) => {
    this.setState({ pageState: newState });
  }

  onEstablishConnection = () => {
    console.log('On submit response');
    this.setState({ pageState: 3 });
  }

  onSignalReceived = () => {
    console.log('On submit request');
    this.setState({ pageState: 12 });
  }

  handleRequest = (event) => {
    event.preventDefault();
    this.setState({ requestSignal: event.target.value });
  };

  handleResponse = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    this.setState({ responseSignal: event.target.value });
  };

  onSubmitResponse = (event) => {
    event.preventDefault();
    const { responseSignal } = this.state;
    const { peerManager } = this.props;
    console.log(`[Connect] Applying response (answer): ${responseSignal}`);
    peerManager.applyResponseManually(responseSignal);
  };

  onSubmitRequest = (event) => {
    event.preventDefault();
    const { requestSignal } = this.state;
    const { peerManager } = this.props;
    console.log(`[Connect] Applying request (offer): ${requestSignal}`);
    peerManager.applyRequestManually(requestSignal, (signal) => {
      console.log(`[Connect] Created response (answer): ${signal}`);
      this.setState({ requestResponseSignal: signal });
    });
  };



  render() {
    const { initiatorSignal, requestSignal, responseSignal, requestResponseSignal, pageState } = this.state;
    return (
      /*
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>Connect Manually</h3>
        <input value={initiatorSignal}/>
        <input value={responseSignal} onChange={this.handleResponse}/>
        <Button onClick={this.onSubmitResponse}>
          Submit Response
        </Button>
        <input value={requestSignal} onChange={this.handleRequest}/>
        <Button onClick={this.onSubmitRequest}>
          Submit Request
        </Button>
        <input value={requestResponseSignal}/>
      </div>
      */

      <div style={{position:'absolute', width:'100%', height:'100%', top:0, left:0, backgroundColor:this.props.theme.backgroundColor, color:this.props.theme.textColor, overflow:'auto'}}>
        { pageState === 0 &&
          <div style={{minWidth:'100px', textAlign:'center', position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'50%', marginTop:'15%' }}>
            <div style={{position:'relative', width:'900px', height:'300px', borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px', marginLeft:'auto', marginRight:'auto',backgroundColor:'gray'}}>
              <h1 style={{position:'relative', top:'15%', marginLeft:'auto', marginRight:'auto'}}> <Badge variant="success"> ? </Badge> What do you want to do? <Badge variant="success"> ? </Badge> </h1>
              <Button style={{position:'absolute', left:'10%', bottom:'15%'}} variant="primary" size="lg" onClick={() => this.changePageState(1)}> I want to connect to my friend </Button>
              <Button style={{position:'absolute', right:'10%', bottom:'15%'}} variant="primary" size="lg" onClick={() => this.changePageState(11)}> My friend wants to connect to me </Button>
            </div>
          </div>
        }
        {
          pageState === 1 &&
          <div style={{textAlign:'center', fontSize:'30px',borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px' ,position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'80%', minHeight:'600px', marginTop:'120px' }}>
            <ProgressBar animated now={33} />
            <div style={{marginTop:'20%'}}>
              <h1> <Badge variant="primary">Step 1</Badge> Copy your signal and send it to your friend. </h1>

              <div style={{position:'relative', marginTop:'10%' , marginLeft:'auto', marginRight:'auto'}}>
                <InputGroup size="lg">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Your Signal</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" value={initiatorSignal} />
                  <InputGroup.Append>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(initiatorSignal)}>Copy</Button>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </div>

            <Button style={{position:'absolute', left: '50%' , transform: 'translateX(-50%)' , bottom:'5%'}} variant="success" size="lg" onClick={() => this.changePageState(2)}>Next Step</Button>

          </div>
        }

        { pageState === 2 &&
          <div style={{textAlign:'center', fontSize:'30px',borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px' ,position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'80%', minHeight:'600px', marginTop:'120px' }}>
            <ProgressBar animated now={66} />
            <div style={{marginTop:'20%'}}>
              <h1> <Badge variant="primary">Step 2</Badge> Paste your friend's signal here </h1>

              <div style={{position:'relative', marginTop:'10%' , marginLeft:'auto', marginRight:'auto'}}>
                <InputGroup size="lg">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Your Friend's Signal</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm"  value={responseSignal} onChange={this.handleResponse} />

                </InputGroup>
              </div>
            </div>

            <Button style={{position:'absolute', left: '50%' , transform: 'translateX(-50%)' , bottom:'5%'}} variant="success" size="lg" onClick={() => this.onEstablishConnection()}>Establish Connection</Button>

          </div>
        }

        { pageState === 3 &&
           <div style={{textAlign:'center', fontSize:'30px',borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px' ,position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'80%', minHeight:'600px', marginTop:'120px' }}>
             <ProgressBar animated now={100} />
             <div style={{marginTop:'20%'}}>
               <h1> <Badge variant="primary">Step 3</Badge> Success ! </h1>

             </div>

           </div>
        }

         { pageState === 11 &&
           <div style={{textAlign:'center', fontSize:'30px',borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px' ,position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'80%', minHeight:'600px', marginTop:'120px' }}>
             <ProgressBar animated now={33} />
             <div style={{marginTop:'20%'}}>
               <h1> <Badge variant="primary">Step 1</Badge> Ask for your friend's signal and paste it below. </h1>

               <div style={{position:'relative', marginTop:'10%' , marginLeft:'auto', marginRight:'auto'}}>
                 <InputGroup size="lg">
                   <InputGroup.Prepend>
                     <InputGroup.Text id="inputGroup-sizing-lg">Your Friend's Signal</InputGroup.Text>
                   </InputGroup.Prepend>
                   <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm"  value={requestSignal} onChange={this.handleRequest} />

                 </InputGroup>
               </div>
             </div>

             <Button style={{position:'absolute', left: '50%' , transform: 'translateX(-50%)' , bottom:'5%'}} variant="success" size="lg" onClick={() => this.onSignalReceived()}>Next Step</Button>

           </div>
         }

        {
          pageState === 12 &&
          <div style={{textAlign:'center', fontSize:'30px',borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px' ,position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'80%', minHeight:'600px', marginTop:'120px' }}>
            <ProgressBar animated now={66} />
            <div style={{marginTop:'20%'}}>
              <h1> <Badge variant="primary">Step 2</Badge> Copy your signal and send it to your friend. </h1>

              <div style={{position:'relative', marginTop:'10%' , marginLeft:'auto', marginRight:'auto'}}>
                <InputGroup size="lg">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-lg">Your Signal</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" value={requestResponseSignal} />
                  <InputGroup.Append>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(requestResponseSignal)}>Copy</Button>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </div>

            <p style={{fontSize:'medium'}}>This signal can only connect you to the signal you have just given!</p>

            <Button style={{position:'absolute', left: '50%' , transform: 'translateX(-50%)' , bottom:'5%'}} variant="success" size="lg" onClick={() => this.changePageState(13)}>You are done !</Button>

          </div>
        }

        { pageState === 13 &&
          <div style={{textAlign:'center', fontSize:'30px',borderColor:'black', borderSize:'5px', borderStyle:'solid', borderRadius:'15px' ,position:'absolute', left: '50%' , transform: 'translateX(-50%)', width:'80%' , height:'80%', minHeight:'600px', marginTop:'120px' }}>
            <ProgressBar animated now={100} />
            <div style={{marginTop:'20%'}}>
              <h1> <Badge variant="primary">Step 3</Badge> Success! </h1>
            </div>
            <div style={{marginTop:'40%'}}>
              <p style={{fontSize:'medium'}}>Once your friend finishes connection setup, you will be connected to PeerNews !</p>
            </div>

          </div>
        }

      </div>

    );
  }
}