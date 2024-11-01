import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GymPlanSelector.css';

const getExercises = async (value: string) => {
    const url = `http://localhost:8080/exercises/names?number=76&offset=0&search=${value}`;
    const options = {
        method: 'GET', 
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.results.map((exercise: any) => exercise.name);
    } catch (error) {
        console.error("Error fetching exercises:", error);
        return [];
    }
}

const GymPlanSelector: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Allows for single page application
    const selectedDay = location.state?.selectedDay || 1; // Passed selectedDay from GymDaysSelector
    const [currentDay, setCurrentDay] = useState<number>(1);
    const [exercises, setExercises] = useState<string[][]>(Array.from({ length: selectedDay }, () => ['', '', '', '', '', ''])); // Array of exercises within an array of length number of days selected
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeField, setActiveField] = useState<number | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
        console.log(exercises)
    }, [exercises]); // Use to ensure array is being updated correctly

    const handleExerciseChange = async (dayIndex: number, exerciseIndex: number, value: string, reset: boolean) => {
        const newExercises = [...exercises]; // Cannot modify original state so create a shallow copy
        newExercises[dayIndex][exerciseIndex] = value;
        if (!reset)
        {
            setExercises(newExercises);
        }
        setActiveField(exerciseIndex);

        if (value.length >= 1) {
            const exerciseList = await getExercises(value);
            setSuggestions(exerciseList);
            if (exerciseList && exerciseList.length) {
                setShowDropdown(true);
            } else {
                setShowDropdown(false);
            }
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 1 character
            setShowDropdown(false);
        } 
    };

    const handleSuggestionClick = (dayIndex: number, exerciseIndex: number, suggestion: string) => {
        const newExercises = [...exercises];
        newExercises[dayIndex][exerciseIndex] = suggestion;
        setExercises(newExercises);
        setSuggestions([]); // Clear suggestions after selecting one
        setShowDropdown(false);
        setActiveField(null);
    };

    const handleDropdownClick = async (activeField: number) => {
        setActiveField(activeField);
        if (showDropdown) {
            setShowDropdown(false);
            setSuggestions([]);
            return;
        }
        let searchInput;
        if (exercises[currentDay - 1][activeField] && exercises[currentDay - 1][activeField].length > 0) {
            searchInput = exercises[currentDay - 1][activeField];
        } else {
            searchInput = '';
        }
        const exerciseList = await getExercises(searchInput);
        setSuggestions(exerciseList);
        setShowDropdown(true);
    }

    const renderExerciseInputs = () => {
        return (
            <div className="exercise-inputs">
                <h2>Day {currentDay}</h2>
                <div className="exercise-list">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="exercise-number" style={{ position: 'relative' }}>
                            <label>Exercise {index + 1}</label>
                            <div className="search-bar-container">
                                <input
                                    className="search-bar"
                                    type="text"
                                    value={exercises[currentDay - 1][index]}
                                    onChange={(e) => handleExerciseChange(currentDay - 1, index, e.target.value, false)}
                                    placeholder="Search for an exercise"
                                    onClick={() => {
                                        setShowDropdown(true); 
                                        setActiveField(index); 
                                    }} 
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
                                    style={{ userSelect: 'none' }}
                                    onClick={async () => handleDropdownClick(index)}
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
                            {/* Display suggested list of exercises when dropdown button is clicked */}
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
        } else {
            navigate('/gym-shuffle', { state: { selectedDay, exercises } }); // Pass exercises to ShufflePlan
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