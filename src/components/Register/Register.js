import React, { Component } from "react";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerName: {
        content: "",
        valid: true,
      },
      registerEmail: {
        content: "",
        valid: true,
      },
      registerPassword: {
        content: "",
        valid: true,
      },
    };
  }

  onNameChange = (event) => {
    this.setState((prevState) => ({
      registerName: {
        ...prevState.registerName,
        content: event.target.value,
      },
    }));
  };

  onEmailChange = (event) => {
    this.setState((prevState) => ({
      registerEmail: {
        ...prevState.registerEmail,
        content: event.target.value,
      },
    }));
  };

  onPasswordChange = (event) => {
    this.setState((prevState) => ({
      registerPassword: {
        ...prevState.registerPassword,
        content: event.target.value,
      },
    }));
  };

  validateInputLength = (input) => {
    return input.length ? true : false;
  };

  updateNameState = (valid) => {
    this.setState((prevState) => ({
      registerName: {
        ...prevState.registerName,
        valid: valid,
      },
    }));
  };

  updateEmailState = (valid) => {
    this.setState((prevState) => ({
      registerEmail: {
        ...prevState.registerEmail,
        valid: valid,
      },
    }));
  };

  updatePasswordState = (valid) => {
    this.setState((prevState) => ({
      registerPassword: {
        ...prevState.registerPassword,
        valid: valid,
      },
    }));
  };

  onKeyDown = (event) => {
    // Handle return key submit
    if (event.keyCode === 13) {
      this.onSubmitRegister();
    }
  }

  onSubmitRegister = () => {
    const validName = this.validateInputLength(
      this.state.registerName.content
    );
    const validEmail = this.validateInputLength(
      this.state.registerEmail.content
    );
    const validPassword = this.validateInputLength(
      this.state.registerPassword.content
    );

    this.updateNameState(validName);
    this.updateEmailState(validEmail);
    this.updatePasswordState(validPassword);

    if (validName && validEmail && validPassword) {
      fetch("https://still-dusk-95539.herokuapp.com/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.state.registerName.content,
          email: this.state.registerEmail.content,
          password: this.state.registerPassword.content,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user) {
            this.props.loadUser(user);
            this.props.onRouteChange("home");
          }
        });
    }
  };

  render() {
    const { registerName, registerEmail, registerPassword } = this.state;

    const renderNameField = (validName) => {
      if (validName) {
        return (
          <>
            <input
              onChange={this.onNameChange}
              className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="text"
              placeholder="e.g. Jane"
              name="name"
              id="name"
              aria-required="true"
            />
          </>
        );
      } else {
        return (
          <>
            <input
              onChange={this.onNameChange}
              className="pa2 input-reset ba bg-transparent b--red hover-bg-black hover-white w-100"
              type="text"
              placeholder="e.g. Jane"
              name="name"
              id="name"
              aria-required="true"
              aria-invalid="true"
              aria-describedby="name-error"
            />
            <p id="name-error" className="dark-red">
              Please enter your name.
            </p>
          </>
        );
      }
    };

    const renderEmailField = (validEmail) => {
      if (validEmail) {
        return (
          <>
            <input
              onChange={this.onEmailChange}
              className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="email"
              placeholder="jane@example.com"
              name="email-address"
              id="email-address"
              aria-required="true"
            />
          </>
        );
      } else {
        return (
          <>
            <input
              onChange={this.onEmailChange}
              className="pa2 input-reset ba bg-transparent b--red hover-bg-black hover-white w-100"
              type="email"
              placeholder="jane@example.com"
              name="email-address"
              id="email-address"
              aria-required="true"
              aria-invalid="true"
              aria-describedby="email-error"
            />
            <p id="email-error" className="dark-red">
              Please enter your email address.
            </p>
          </>
        );
      }
    };

    const renderPasswordField = (validPassword) => {
      if (validPassword) {
        return (
          <>
            <input
              onChange={this.onPasswordChange}
              onKeyDown={this.onKeyDown}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="password"
              name="password"
              id="password"
              aria-required="true"
            />
          </>
        );
      } else {
        return (
          <>
            <input
              onChange={this.onPasswordChange}
              onKeyDown={this.onKeyDown}
              className="b pa2 input-reset ba bg-transparent b--red hover-bg-black hover-white w-100"
              type="password"
              name="password"
              id="password"
              aria-required="true"
              aria-invalid="true"
              aria-describedby="password-error"
            />
            <p id="password-error" className="dark-red">
              Please enter a password.
            </p>
          </>
        );
      }
    };

    return (
      <div className="form-container">
        <div className="form-style pa4 black-80 br2 ba dark-gray b--black-10 mv4 w-100 w-65-m w-35-l mw6 shadow-4 center">
          <div className="form w-70 center">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f2 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name (required)
                </label>
                {renderNameField(registerName.valid)}
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email (required)
                </label>
                {renderEmailField(registerEmail.valid)}
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password (required)
                </label>
                {renderPasswordField(registerPassword.valid)}
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
                onClick={this.onSubmitRegister}
                onKeyDown={this.onKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
