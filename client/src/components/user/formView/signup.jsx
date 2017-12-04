import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router-dom';
import $ from 'jquery';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Checkbox from 'react-bootstrap/lib/Checkbox';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      checkPassword: '',
      firstName: '',
      lastName: ''
    };
    this.hanldeSubmit = this.hanldeSubmit.bind(this);
  }

  onUsernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onFirstNameChange(e) {
    this.setState({
      firstName: e.target.value,
    });
  }

  onLastNameChange(e) {
    this.setState({
      lastName: e.target.value,
    });
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onCheckPasswordChange(e) {
    this.setState({
      checkPassword: e.target.value,
    });
  }

  onAdminCheck(e) {
    this.setState({
      admin: 'admin',
    });
  }

  hanldeSubmit() {
    console.log('im inside', this.props.location, this.props.lat, this.props.long);

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/signup',
        data: {
          username: this.state.username,
          hash: this.state.password,
          hash2: this.state.checkPassword,
          salt: '',
          account_type: 'user',
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          location: this.props.location,
          lat: this.props.lat,
          long: this.props.long
        },
        success: (data) => {
          alert('You have successfully created an account');
          this.props.addUser(this.state.username);
          resolve(data);
        },
        error: (error) => {
          alert(error.responseText);
          reject(error);
        },
      });
    });
  }


  render() {
    //This button signs the user up into our database
    const ButtonSignUp = withRouter(({history}) => (
      <Button
        className="sign-up-button"
        bsStyle="primary"
        onClick={()=> {
          this.hanldeSubmit()
            .then(()=> history.push('/Character'))
            .catch(()=> console.log('there was an error'))
        }}>
        Create Account</Button>
    ));
    //This button takes the user to the sign in page
    const ButtonSignIn = withRouter(({history}) => (
      <Button
        className="sign-up-button"
        bsStyle="primary"
        onClick={()=> {
          history.push('/Login')
        }}>
        Return to log in page</Button>
    ))
    return (
      <div className="container signup-container">
        <PageHeader><small>Signup</small></PageHeader>
        <ControlLabel className="signup-username">
          Username<FormControl type="text" placeholder="username..." onChange={this.onUsernameChange.bind(this)} />
        </ControlLabel>
        <br />
        <ControlLabel className="signup-username">
          First Name<FormControl type="text" placeholder="first name..." onChange={this.onFirstNameChange.bind(this)} />
        </ControlLabel>
        <br />
        <ControlLabel className="signup-username">
          Last Name<FormControl type="text" placeholder="last name..." onChange={this.onLastNameChange.bind(this)} />
        </ControlLabel>
        <br />
        <ControlLabel className="signup-password">
          Password<FormControl type="password" placeholder="password..." onChange={this.onPasswordChange.bind(this)} />
        </ControlLabel>
        <br />
        <ControlLabel className="signup-password">
          Type Password Again<FormControl type="password" placeholder="password..." onChange={this.onCheckPasswordChange.bind(this)} />
        </ControlLabel>
        <br />

        <div className="col-centered">
          <ButtonToolbar>
            <ButtonSignUp/>
            <ButtonSignIn/>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}

export default Signup;
