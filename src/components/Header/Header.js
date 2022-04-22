import React from "react";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import "./Header.css";

const Header = ({ onRouteChange, isSignedIn }) => {
  const renderLogo = (isSignedIn) => {
    if (isSignedIn) {
      return <Logo />;
    }
  };

  return (
    <header className="header ph4 black">
      {renderLogo(isSignedIn)}
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
    </header>
  );
};

export default Header;
