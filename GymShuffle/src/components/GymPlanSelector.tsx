import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GymPlanSelector.css';

const GymPlanSelector: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Allows for single page application
    const selectedDay = location.state?.selectedDay || 1; // Passed selectedDay from GymDaysSelector
    const [currentDay, setCurrentDay] = useState<number>(1);
    const [exercises, setExercises] = useState<string[][]>(Array(selectedDay).fill(['', '', '', '', '', ''])); // Array of exercises within an array of lengthnumber of days selected
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeField, setActiveField] = useState<number | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleExerciseChange = async (dayIndex: number, exerciseIndex: number, value: string, reset: boolean) => {
        const newExercises = [...exercises]; // Cannot modify original state so create a shallow copy
        newExercises[dayIndex][exerciseIndex] = value;
        if (!reset)
        {
            setExercises(newExercises);
        }
        setActiveField(exerciseIndex);
        setShowDropdown(false);

        /* if (value.length >= 3) {
            setLoading(true);
            const url = `https://gym-fit-main-ea7edf6.d2.zuplo.dev/v1/exercises/search?query=${value}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'ADD KEY HERE',
                    'X-RapidAPI-Host': 'gym-fit-main-ea7edf6.d2.zuplo.dev'
                }
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                const exerciseNames = data.results.map((exercise: any) => exercise.name);
                setSuggestions(exerciseNames); // Update suggestions state
            } catch (error) {
                console.error("Error fetching exercises:", error);
                setSuggestions([]); 
            } 
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 3 characters
        } */
    };

    const handleSuggestionClick = (dayIndex: number, exerciseIndex: number, suggestion: string) => {
        const newExercises = [...exercises];
        newExercises[dayIndex][exerciseIndex] = suggestion;
        setExercises(newExercises);
        setSuggestions([]); // Clear suggestions after selecting one
        setActiveField(null);
    };

    const renderExerciseInputs = () => {
        return (
            <div className="exercise-inputs">
                <h2>Day {currentDay}</h2>
                <div className="exercise-list">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="exercise-item" style={{ position: 'relative' }}>
                            <label>Exercise {index + 1}</label>
                            <div className="search-bar-container">
                                <input
                                    className="search-bar"
                                    type="text"
                                    value={exercises[currentDay - 1][index]}
                                    onChange={(e) => handleExerciseChange(currentDay - 1, index, e.target.value, false)}
                                    placeholder="Search for an exercise"
                                    onFocus={() => setActiveField(index)} 
                                    onClick={() => setShowDropdown(true)} // Show dropdown when clicking on the input
                                />
                                {exercises[currentDay - 1][index] && (
                                    <span
                                        className="clear-button"
                                        onClick={() => handleExerciseChange(currentDay - 1, index, '', false)}
                                    >
                                        &#x2715; {/* X button */}
                                    </span>
                                )}
                                <span
                                    className="dropdown-button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    &#x25BC; {/* Dropdown Arrow */}
                                </span>
                            </div>

                            {/* Only show suggestions for the active field */}
                            {activeField === index && suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, i) => (
                                        <li
                                            key={i}
                                            onClick={() => handleSuggestionClick(currentDay - 1, index, suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* Show dropdown with all exercises when clicking the dropdown button */}
                            {activeField === index && showDropdown && (
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, i) => (
                                        <li
                                            key={i}
                                            onClick={() => handleSuggestionClick(currentDay - 1, index, suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleNextDay = () => {
        if (exercises[currentDay - 1].filter(ex => ex !== '').length === 0) { // Checks if no exercises have been inputted
            setErrorMessage('Add an exercise to continue');
            return;
        }
        setErrorMessage('');
        if (currentDay < selectedDay) { // Checks if all exercises for each of the days have been submitted
            setCurrentDay(currentDay + 1);
            for (let index = 0; index < 6; ++index)
            {
                handleExerciseChange(currentDay - 1, index, '', true); // Might cause issues, test when api is active
            }
        } else {
            navigate('/gym-shuffle', { state: { selectedDay } });
        }
    };

    return (
        <div className="gym-plan">
            {renderExerciseInputs()}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button
                className="next-button"
                onClick={handleNextDay}
            >
                {currentDay < selectedDay ? 'Next Day' : 'Confirm'}
            </button>
        </div>
    );
}

export default GymPlanSelector;
