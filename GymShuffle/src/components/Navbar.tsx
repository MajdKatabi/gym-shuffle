import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/GymShuffleLogo.png';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <a href="/">
                <img src={logo} alt="GymShuffle Logo" className="navbar-logo" />
            </a>
            <div className="navbar-center">
                <a href="/" className="nav-link">Home</a>
                <a href="#about" className="nav-link">About</a>
            </div>

            <Link to="/gym-days" className="get-started-button">Get Started</Link>
        </nav>
    );
}

export default Navbar;
