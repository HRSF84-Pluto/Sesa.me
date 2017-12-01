import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link} from 'react-router-dom';
import $ from 'jquery';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import PageHeader from 'react-bootstrap/lib/PageHeader';

class Login extends React.Component {
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
    //This button redirrects the user to the Signup page
    const ButtonSignUp = withRouter(({ history }) => (
      <Button
        className="login-button"
        bsStyle="primary"
        onClick={()=> {
          history.push('/Signup')
        }}>
        Signup</Button>
    ))
    const ButtonLogin = withRouter(({ history }) => (
      <Button
        className="login-button"
        bsStyle="primary"
        onClick={()=> {
          this.handleSubmit()
            .then(()=> history.push('/Game'))
            .catch(()=> console.log('there was an error'))
        }}>
        Signup</Button>
    ))
    return (
      <div className="container login-container">
        <div>
          <PageHeader><small>Login:</small></PageHeader>
          <ControlLabel className="login-username" >Username<FormControl type="text" placeholder="username..." onChange={this.onUsernameChange.bind(this)} /></ControlLabel>
          <br />
          <ControlLabel className="login-password">Password<FormControl type="password" placeholder="password..." onChange={this.onPasswordChange.bind(this)} /></ControlLabel>
          <br />
          <ButtonLogin/>
        </div>
        <div>
          <PageHeader><small>Don't have an account? Sign up:</small></PageHeader>
          <ButtonSignUp/>
        </div>
      </div>
    );
  }
}

export default Login;
