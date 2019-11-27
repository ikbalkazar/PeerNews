import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default class NavigationBar extends React.Component {
  handleLogout = (event) => {
    event.preventDefault();
    this.props.onLogout();
  };

  render () {
    const { pages, onClickPage } = this.props;
    return (
      <div style={{height:'30px'}}>
        <Navbar bg="dark" variant="dark" fixed="top" >
          <Navbar.Brand href="#home">Peer News</Navbar.Brand>
          <Nav className="mr-auto">
            {pages.map(page => (
              <Nav.Link
                key={page.id}
                onClick={() => onClickPage(page.id)}
              >
                {page.name}
              </Nav.Link>
            ))}
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
            <Button variant="danger" className="mr-sm-2" onClick={this.handleLogout}>Logout</Button>
          </Form>
        </Navbar>
      </div>
    );
  }
}