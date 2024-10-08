import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ShufflePlan.css';

const ShufflePlan: React.FC = () => {
    const location = useLocation();
    const selectedDay = location.state.selectedDay;
    const exercises = location.state.exercises; // Receive exercise array from GymPlanSelector
    const [clickedDay, setClickedDay] = useState<number>(1);

    useEffect(() => {
        console.log(exercises)
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
                                    onChange={() => setClickedDay(index + 1)}
                                />
                                Day {index + 1}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderExercises = () => {
        return (
            <div className="exercise-boxes">
                <h2>Exercises for Day {clickedDay}</h2>
                <div className="exercise-list">
                    {exercises[clickedDay - 1].map((exercise: string, index: number) => (
                        <div key={index} className="exercise-box">
                            {exercise || 'No exercise assigned'}
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