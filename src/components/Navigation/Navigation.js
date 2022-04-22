import React from "react";
import "./Navigation.css";

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav>
        <p
          className="f4 ph3 link dim underline pointer"
          onClick={() => onRouteChange("signIn")}
        >
          Sign out
        </p>
      </nav>
    );
  } else {
    return (
      <nav>
        <p
          className="f4 ph3 link dim underline pointer"
          onClick={() => onRouteChange("signIn")}
        >
          Sign in
        </p>
        <p
          className="f4 ph3 link dim underline pointer"
          onClick={() => onRouteChange("register")}
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
