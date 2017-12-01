import React from 'react';
import ReactDOM from 'react-dom';
import Message from './message.jsx';
import Button from 'react-bootstrap/lib/Button';


class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // example data for mocking
      messages: [
        {
          id: 1,
          createdAt: '10/20/2017',
          first_name: 'Jane',
          last_name: 'Smith',
          user_message: 'Test message',
          user_contact: 'Test contact info',
          user_urgency: '3',
        },
        {
          id: 2,
          createdAt: '10/19/2017',
          first_name: 'Lady',
          last_name: 'Person',
          user_message: 'Test message 2',
          user_contact: 'Test contact info 2',
          user_urgency: '1',
        },
      ],
      messageId: null,
      response: '',
    };
  }
////////do THIS THIS UCOMMENT WHEN YOU FIGURE OUT WHATS WRONG 
  // componentDidMount() {
  //   this.props.retrieveOpenMessages((data) => {
  //     console.log('ADMIN MESSAGES', data);
  //     this.setState({
  //       // may have to change 'data' depending on format
  //       messages: data,
  //     });
  //   });
  // }

  // componentWillReceiveProps() {
  //   this.props.retrieveOpenMessages( (data) => {
  //     console.log('ADMIN MESSAGES', data);
  //     this.setState({
  //       //may have to change 'data' depending on format
  //       messages: data
  //     });
  //   });
  // }

  // sets state variable messageId to currently selected message's id
  setResponseId(id) {
    this.setState({
      messageId: id,
    });
  }

  // calls the markAsComplete method in index.jsx to send id and status to server
  setStatus(id) {
    this.props.markAsComplete(id);
  }


  render() {
    return (
      <div>
        {/* <Button onClick={this.props.showLogIn.bind(this)} className="admin-change-user-button" bsSize="small" bsStyle="primary">Sign In as a Different User</Button> */}
        <div className="admin-header group">
          <h3 className="welcome-header">Welcome to Your Inbox!</h3>
          <h4>You can view and respond to user messages here.</h4>
        </div>

        {/* <ul className="user-message-ul">
          {this.state.messages.map((message, index) => <Message submitAdminResponse={this.props.submitAdminResponse} setStatus={this.setStatus.bind(this)} setResponseId={this.setResponseId.bind(this)} key={index} message={message} />)}
        </ul> */}

      </div>
    );
  }
}

export default AdminView;
