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
      hash: '',
      source: 'user',
      location: '',
      lat: '',
      long: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onUsernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onPasswordChange(e) {
    this.setState({
      hash: e.target.value,
    });
  }

  componentWillMount() {
    const options = {
      enableHighAccuracy: true,
      timeout: 4000,
      maximumAge: 0
    };

    const success = (pos)=> {
      console.log("coordinates ", pos.coords);
      const crd = pos.coords;
      //console.log(crd);
      const url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&sensor=true`;
      $.ajax({
        url: url,
        type: 'GET',
        success: response=>{
          const lat = crd.latitude;
          const long = crd.longitude;
          const location = response.results[0]['formatted_address'];
          this.setState({lat, long, location});
        }
      });
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

  }

  //it's not sending down thing
  handleSubmit() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/login',
        data: this.state,
        success: (data) => {
          alert('You are logged on');
          this.props.addUser(this.state.username);
          resolve(data);
        },
        error: (error) => {
          alert('Please enter a valid credentials');
          console.log(`Error in logging in: ${error}`);
          reject(error);
        },
      });
    });

  }

  onSubmit(event) {
    event.preventDefault();
    this.props.logInUser(this.state.username, this.state.hash);
  }

  render() {
    //This button redirrects the user to the Signup page
    const ButtonSignUp = withRouter(({ history }) => (
      <Button
        className="login-button"
        bsStyle="primary"
        onClick={()=> {
          history.push('/Signup');
        }}>
        Signup</Button>
    ));
    const ButtonLogin = withRouter(({ history }) => (
      <Button
        className="login-button"
        bsStyle="primary"
        onClick={()=> {
          this.handleSubmit()
            .then(()=> history.push('/Game'))
            .catch(()=> console.log('Invalid credentials'));
        }}>
        Login</Button>
    ));
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
