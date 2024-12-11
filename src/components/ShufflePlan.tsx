import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShufflePlan.css';

const fetchAlternatives = async (exercise: string) => {
    const slug = exercise.toLowerCase().replace(/\s+/g, '-');
    const url = `http://localhost:8080/exercises/${slug}/alternatives`;
    const options = { method: 'GET' };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.alternatives || [];
    } catch (error) {
        console.error("Error fetching alternatives:", error);
        return [];
    }
};

const fetchVariations = async (exercise: string) => {
    const slug = exercise.toLowerCase().replace(/\s+/g, '-');
    const url = `http://localhost:8080/exercises/${slug}/variations`;
    const options = { method: 'GET' };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.variations || [];
    } catch (error) {
        console.error("Error fetching variations:", error);
        return [];
    }
};

const ShufflePlan: React.FC = () => {
    const location = useLocation();
    const selectedDay = location.state.selectedDay;
    const exercises = location.state.exercises; 
    const [clickedDay, setClickedDay] = useState<number>(1);
    const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
    const [indexOfDisplayedExeriseGrid, setIndexOfDisplayedExeriseGrid] = useState<number | undefined>(undefined);
    const [alternatives, setAlternatives] = useState<{ name: string; _id: string }[]>([]);
    const [variations, setVariations] = useState<{ name: string; _id: string }[]>([]);

    useEffect(() => {
        console.log(exercises);
    }, [exercises]);

    const handleExerciseClick = async (index: number) => {
        setSelectedExercise(selectedExercise === index ? null : index);
        setIndexOfDisplayedExeriseGrid(index);

        const selectedExerciseName = exercises[clickedDay - 1][index];
        if (selectedExerciseName) {
            const fetchedAlternatives = await fetchAlternatives(selectedExerciseName);
            const fetchedVariations = await fetchVariations(selectedExerciseName);
            setAlternatives(fetchedAlternatives);
            setVariations(fetchedVariations);
        }
    };

    const renderAlternativesAndVariations = () => {
        return (
            <div className="alternatives-variations">
                <h2>Alternatives</h2>
                <div className="alternatives-grid">
                    {alternatives.length > 0 ? (
                        alternatives.map((alt) => (
                            <div key={alt._id} className="alternative-box">
                                {alt.name}
                            </div>
                        ))
                    ) : (
                        <p>No alternatives available.</p>
                    )}
                </div>
                <h2>Variations</h2>
                <div className="variations-grid">
                    {variations.length > 0 ? (
                        variations.map((varia) => (
                            <div key={varia._id} className="variation-box">
                                {varia.name}
                            </div>
                        ))
                    ) : (
                        <p>No variations available.</p>
                    )}
                </div>
            </div>
        );
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
                {indexOfDisplayedExeriseGrid !== undefined && (
                    renderAlternativesAndVariations() 
                )}
            </div>
        );
    };

    return (
        <div>
            {renderExercises()} 
            <hr></hr>
        </div>
    );
};

export default ShufflePlan;
