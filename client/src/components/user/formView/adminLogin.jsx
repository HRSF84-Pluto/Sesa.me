import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link} from 'react-router-dom';
import $ from 'jquery';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import PageHeader from 'react-bootstrap/lib/PageHeader';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onUsernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleSubmit() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/login',
        data: {
          username: this.state.username,
          hash: this.state.password,
        },
        success: (data) => {
          console.log('back from loggin')
          this.props.addUser(this.state.username);
          resolve(data);
        },
        error: (error) => {
          alert('Incorrect password');
          console.log('Unsuccessful login with error: ', error);
          reject(error);
        },
      });
    });
  }

  render() {
    const ButtonSignUp = withRouter(({history}) => (
      <Button
        className="sign-up-button"
        bsStyle="primary"
        onClick={()=> {
          history.push('/Login')
        }}>
        Return to log in page</Button>
    ))
    const ButtonSignIn = withRouter(({history}) => (
      <Button
        bsStyle="primary"
        className="login-button"
        onClick={()=> {
          this.handleSubmit()
          .then(()=> history.push('/AdminView'))
          .catch(()=> console.log('there was an error'))
        }}>Log In</Button>
    ))
    //Need to change the request a page to do soemthing with the sign ups
    return (
      <div className="container login-container">
        <div>
          <PageHeader><small>Admin Login:</small></PageHeader>
          <ControlLabel className="login-username" >Username<FormControl type="text" placeholder="username..." onChange={this.onUsernameChange.bind(this)} /></ControlLabel>
          <br />
          <ControlLabel className="login-password">Password<FormControl type="password" placeholder="password..." onChange={this.onPasswordChange.bind(this)} /></ControlLabel>
          <br />
          <ButtonSignIn/>
          <br />
        </div>
        <div>
          <PageHeader><small>Don't have an account? Request one:</small></PageHeader>
          <ButtonSignUp/>
        </div>
      </div>
    );
  }
}

export default AdminLogin;
