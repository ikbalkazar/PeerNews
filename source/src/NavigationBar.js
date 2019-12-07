import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default class NavigationBar extends React.Component {
  state = {
    keyword: null,
  };

  handleLogout = (event) => {
    event.preventDefault();
    this.props.onLogout();
  };

  handleSearchClick = (event) => {
    event.preventDefault();
    this.props.onSearchClick(this.state.keyword);
  };

  render () {
    const { pages, onClickPage, activePage, searchedKeyword, onSearchedKeywordChange } = this.props;
    const { keyword } = this.state;
    return (
      <div style={{height:'30px'}}>
        <Navbar bg="dark" variant="dark" fixed="top" >
          <Navbar.Brand href="#home">Peer News</Navbar.Brand>
          <Nav className="mr-auto">
            {pages.map(page => (
              <Nav.Link
                key={page.id}
                style={ activePage === page.id ? {color:'#17a2b8'} : {color:""}}
                onClick={() => onClickPage(page.id)}
              >
                {page.name}
              </Nav.Link>
            ))}
          </Nav>
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={keyword}
              onChange={(e) => this.setState({ keyword: e.target.value })}
            />
            <Button
              variant="outline-info"
              style={{marginRight: 15}}
              onClick={this.handleSearchClick}
            >
              Search
            </Button>
            <Button variant="danger" className="mr-sm-2" onClick={this.handleLogout}>Logout</Button>
          </Form>
        </Navbar>
      </div>
    );
  }
}