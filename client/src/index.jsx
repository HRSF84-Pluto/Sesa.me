import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import $ from 'jquery';
import Game from './components/user/tictactoeView/game.jsx';
import Main from './components/user/Main.jsx';
import Login from './components/user/formView/login.jsx';
import AdminLogin from './components/user/formView/adminLogin.jsx';
import Signup from './components/user/formView/signup.jsx';
import AdminView from './components/admin/adminView.jsx';
import Character from './components/user/makeCharacter/makeCharacter.jsx';
import PacManGame from './components/user/PacManView/index.jsx';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import PageHeader from 'react-bootstrap/lib/PageHeader';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      type: '',
      showForms: false,
      // Possible view values:
      // restricted: only render game
      // unrestricted: render game, login and signup buttons (after user has clicked button 10x)
      // login: render login component (if user clicks on login button)
      // signup: render signup component (if user clicks on signup button OR creates an account, will be redirected)
      // submissions: render sumbissions component (if user is successfully logged in)
      showBugButton: false,
    };

    this.unlockForms = this.unlockForms.bind(this);
    this.onEsc = this.onEsc.bind(this);
    this.hideBugButton = this.hideBugButton.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEsc, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEsc, false);
  }

  addUser(username) {
    this.setState({
      username: username
    });
  }

  sendMessage(username, contact, urgency, message) {
    console.log(`${username}, ${contact}, ${urgency}, ${message} requested post to server as new message`);
    $.ajax({
      method: 'POST',
      url: '/submissions',
      data: {
        username,
        user_contact: contact,
        user_urgency: urgency,
        user_message: message,
      },
      success: (data) => {
        console.log(data);
        alert('Your message was sent succesfully. Check back often for status updates.');
      },
      error: (error) => {
        console.log('Error sending message with', error);
      },
    });
  }

  retrieveResponses(username, callback) {
    console.log(`in retrieveResponses with ${username}`);
    $.ajax({
      method: 'GET',
      url: `/submissions?username=${username}&account_type=null`,
      success: (data) => {
        console.log('USER MESSAGES', data);
        callback(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  retrieveOpenMessages(callback) {
    console.log('in retrieveAllResponses');
    $.ajax({
      method: 'GET',
      url: `/submissions?username=${this.state.username}&account_type=${this.state.type}`,
      success: (data) => {
        console.log(data);
        callback(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  submitAdminResponse(id, response) {
    console.log(`in submitAdminResponse with ${id}, ${response}`);
    $.ajax({
      method: 'PATCH',
      url: '/submissions',
      data: {
        id,
        admin_response: response,
      },
      success: (data) => {
        console.log(data);
        alert('Your response was sent successfully');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  markAsComplete(id) {
    console.log(`in markAsComplete with ${id}`);
    $.ajax({
      method: 'PATCH',
      url: '/submissions',
      data: {
        id,
        admin_complete: true,
      },
      success: (data) => {
        console.log(data);
        alert('This messages has been marked as complete. It will no longer appear in your inbox.');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  hideBugButton() {
    this.setState({
      showBugButton: false,
    });
  }

  unlockForms() {
    this.setState({ showBugButton: true });
  }

  onEsc(e) {
    if (e.keyCode === 27) {
      this.setState({ view: 'restricted' });
    }
  }

  render() {
    return (
    <div>
      <Router>
        <div>
          <Route exact path='/'
            render={() => <Main/>}/>
          <Route exact path='/Login'
            render={() => <Login addUser={this.addUser}/>}/>
          <Route exact path='/Signup'
            render={() => <Signup addUser={this.addUser}/>}/>
          <Route exact path='/AdminLogin'
            render={() => <AdminLogin addUser={this.addUser}/>}/>
          <Route exact path='/AdminView'
            render={() => <AdminView/>}/>
          <Route exact path='/Character'
            render={() => <Character/>}/>
          <Route exact path='/Game'
            render={() => <Game/>}/>
          <Route exact path='/PacManGame'
            render={() => <PacManGame/>}/>
        </div>
      </Router>
    </div>
  )}
}

ReactDOM.render(<App />, document.getElementById('app'));
