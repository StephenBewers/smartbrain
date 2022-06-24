import React, { Component } from "react";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      badCredentials: false,
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  onKeyDown = (event) => {
    // Handle return key submit
    if (event.keyCode === 13) {
      this.onSubmitSignIn();
    }
  }

  onSubmitSignIn = () => {
    fetch("https://still-dusk-95539.herokuapp.com/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
    .then(response => response.json())
    .then(user => {
      if(user.id){
        this.setState({badCredentials: false})
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      } else {
        this.setState({badCredentials: true})
      }
    })
  };

  render() {
    const { onRouteChange } = this.props;
    const { badCredentials } = this.state;

    const showErrorMessage = (badCredentials) => {
      if (badCredentials) {
        return (
          <p  id="login-error" className="dark-red">Incorrect email or password. Please try again.</p>
        )
      }
    }

    return (
      <div className="form-container">
        <div className="pa4 black-80 br2 ba dark-gray b--black-10 mv4 w-100 w-65-m w-35-l mw6 shadow-4 center">
          <div className="form w-70 center">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f2 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={this.onPasswordChange}
                  onKeyDown={this.onKeyDown}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
              {showErrorMessage(badCredentials)}
            </fieldset>
            <div>
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
                onClick={this.onSubmitSignIn}
                onKeyDown={this.onKeyDown}
              />
            </div>
            <div className="lh-copy mt3">
              <p
                className="f6 link dim black db pointer underline"
                onClick={() => onRouteChange("register")}
              >
                Register
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
