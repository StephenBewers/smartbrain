import React from 'react';
import Logo from '../Logo/Logo'
import Navigation from '../Navigation/Navigation';
import './Header.css';

const Header = () => {
    return (
        <header className="header ph4 black">
            <Logo />
            <Navigation />
        </header>
    )
}

export default Header;