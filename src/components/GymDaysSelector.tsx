import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/GymDaysSelector.css';

const GymDaysSelector: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleDayClick = (day : number) => {
        if (selectedDay === day) {
            setSelectedDay(null);
        }
        else {
            setSelectedDay(day);
        }
        setErrorMessage(''); // Clear previous error message
    };

    const handleContinue = () => {
        if (selectedDay === null) {
            setErrorMessage('Please select a day to continue');
            return;
        }
        navigate('/gym-plan', { state: { selectedDay } }); // Pass selected days to GymPlan component
    };

    const renderDayButtons = () => {
        const days = [1, 2, 3, 4, 5, 6, 7];
        return days.map((day) => (
            <button
                key = {day}
                className={`day-button ${selectedDay && selectedDay >= day ? 'selected' : ''}`}
                onClick = {() => handleDayClick(day)}
            >
                Day {day}
            </button>
        ));
    };

    return (
        <div className="gym-days">
            <h2>How many days a week are you currently committed to your gym routine?</h2>
            <div className="days-container">
                {renderDayButtons()}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="continue-button" onClick={handleContinue}>Continue 👉</button>
        </div>
    );
}

export default GymDaysSelector;