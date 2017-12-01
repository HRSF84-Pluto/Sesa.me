if (this.state.showBugButton === true) {
  return (<div>
    <h1 className="main-title">Tic Tac Toe</h1>
    <Game />
    <div className="report-bug-message">
      <p>It looks like you've found a bug.  Would you like to report it?</p>
      <Button className="bug-button" bsSize="xsmall" bsStyle="primary" onClick={this.showLogIn.bind(this)}>yes</Button>
      <Button className="bug-button" bsSize="xsmall" bsStyle="primary" onClick={this.hideBugButton}>no</Button>
    </div>
          </div>);
} else if (this.state.view === 'login') {
  return (<div>
    <h1 className="main-title">Tic Tac Toe</h1>
    <Game />
    <div>
      <Login logInUser={this.logInUser.bind(this)} showSignUp={this.showSignUp.bind(this)} />
    </div>

  </div>);
}else if (this.state.view === 'signup') {
  return (<div>
    <div>
      <Signup createUser={this.createUser.bind(this)} showLogIn={this.showLogIn.bind(this)} />
    </div>
  </div>);
} else if (this.state.view === 'submission' && this.state.type === 'admin') {
  return (
    <div>
      <AdminView showLogIn={this.showLogIn.bind(this)} markAsComplete={this.markAsComplete.bind(this)} submitAdminResponse={this.submitAdminResponse.bind(this)} retrieveOpenMessages={this.retrieveOpenMessages.bind(this)} />
    </div>);
} else if (this.state.view === 'submission') {
  return (
    <div>
      <h1 className="main-title">Tic Tac Toe</h1>
      <Game />
      <div>
        <Submission username={this.state.username} sendMessage={this.sendMessage.bind(this)} retrieveResponses={this.retrieveResponses.bind(this)} showAdminResponses={this.showAdminResponses} />
      </div>
    </div>);
} else if (this.state.view === 'responses') {
  return (
    <div>
      <Game />
      <div>
        <UserResponses showSubmissionForm={this.showSubmissionForm} retrieveResponses={this.retrieveResponses.bind(this)} username={this.state.username} />
      </div>
    </div>
  );
} else if (this.state.view === 'restricted') {
  return (
    <div>
      <h1 className="main-title">Tic Tac Toe</h1>
      <Game unlockForms={this.unlockForms} />

    </div>);
}

// admin login button removed from line 305...
// <Button onClick={this.showAdminLogIn.bind(this)}>Admin Login</Button>
