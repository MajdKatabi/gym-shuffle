import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ShufflePlan.css';

const ShufflePlan: React.FC = () => {
    const location = useLocation();
    const selectedDay = location.state.selectedDay;
    const exercises = location.state.exercises; 
    const [clickedDay, setClickedDay] = useState<number>(1);
    const [selectedExercise, setSelectedExercise] = useState<number | null>(null);

    useEffect(() => {
        console.log(exercises);
    }, [exercises]); // Use to ensure array is being updated correctly

    const renderDaySelector = () => {
        return (
            <div>
                <h1>Select a day to alternate exercises</h1>
                <div className="day-selector">
                    {Array.from({ length: selectedDay }).map((_, index) => (
                        <div key={index} className="day-item">
                            <label>
                                <input
                                    type="radio"
                                    name="selectedDay"
                                    value={index + 1}
                                    checked={clickedDay === index + 1}
                                    onChange={() => { setClickedDay(index + 1); setSelectedExercise(null)}}
                                />
                                Day {index + 1}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleExerciseClick = (index: number) => {
        setSelectedExercise(selectedExercise === index ? null : index);
    };

    const renderExercises = () => {
        return (
            <div className="exercise-boxes">
                <h2>Exercises for Day {clickedDay}</h2>
                <div className="exercise-grid">
                    {exercises[clickedDay - 1].map((exercise: string, index: number) => (
                        <div key={index} className="exercise-set" style={{ position: 'relative' }}>
                            <label>Exercise {index + 1}</label>
                            <div
                                key={index}
                                className={`exercise-box ${(selectedExercise === index && exercises[clickedDay - 1][index]) ? 'selected' : ''}`}
                                onClick={() => handleExerciseClick(index)}
                            >
                                <div className="exercise-container">
                                    {exercise}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderDaySelector()}
            {renderExercises()}
        </div>
    );
};

export default ShufflePlan;
