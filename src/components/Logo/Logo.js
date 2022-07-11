import React from 'react';
import './Logo.css';
import logoImage from './logo.png';

const Logo = () => {
    return (
        <div className="logo-container pv3 dark-blue">
            <img src={logoImage} alt="SmartBrain logo" className="logo" />
            <div className="heading ph3">
                <h1 className="bb f2 mv2 pb1">Smart<span className="blue">Brain</span></h1>
                <span id="subtitle" className="f5">Face Recognition</span>
            </div>
        </div>
    )
}

export default Logo;