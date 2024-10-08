import React from 'react';
import { Link } from 'react-router-dom';
import './HomeSection.css';

const HomeSection: React.FC = () => {
    return (
        <div className="home-section">
            <h1>
                Enhance your <span className="emphasize-color">Entire Gym Plan</span> 💪 in <span className="emphasize-color">30</span> seconds ⏱️
            </h1>
            <p className="home-description">
                Unlock your potental and eliminate the repetitiveness in your gym plan.
                If you are struggling to stay consistent, our trusted app has you covered.
            </p>
            <Link to="/gym-days" className="start-button">Start Now</Link>
        </div>
    );
}

export default HomeSection;