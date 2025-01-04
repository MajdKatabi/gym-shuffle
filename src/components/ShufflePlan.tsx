import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ShufflePlan.css';
import ExercisePopup from './ExercisePopup';

interface ExerciseDetails {
    name: string;
    bodyPart: string;
    target: string;
    synergist: string;
    stabilizer: string;
    instructions: { order: number; description: string }[];
    alternatives: { name: string; _id: string }[];
    variations: { name: string; _id: string }[];
}

interface Muscle {
    name: string;
    group: string | null;
    _id: { $oid: string };
}

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

const fetchExerciseDetails = async (exerciseName: string) => {
    const slug = exerciseName.toLowerCase().replace(/\s+/g, '-');
    const url = `http://localhost:8080/exercises/${slug}/details`;
    const options = { method: 'GET' };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching exercise details:", error);
        return null;
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
    const [showPopup, setShowPopup] = useState(false);
    const [selectedExerciseDetails, setSelectedExerciseDetails] = useState<ExerciseDetails | null>(null);

    useEffect(() => {
        console.log(exercises);
    }, [exercises]);

    const renderDayButtons = () => {
        return (
            <div className="day-buttons">
                {Array.from({ length: selectedDay }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setClickedDay(index + 1)
                            setSelectedExercise(null);
                            setAlternatives([]);
                            setVariations([]); 
                        }} 
                        className={clickedDay === index + 1 ? 'active' : ''}
                    >
                        Day {index + 1}
                    </button>
                ))}
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

    const handleExerciseClick = async (index: number) => {
        if (selectedExercise === index) {
            setSelectedExercise(null);
            setIndexOfDisplayedExeriseGrid(undefined);
            setAlternatives([]); 
            setVariations([]); 
        } else {
            setSelectedExercise(index);
            setIndexOfDisplayedExeriseGrid(index);

            const selectedExerciseName = exercises[clickedDay - 1][index];
            if (selectedExerciseName) {
                const fetchedAlternatives = await fetchAlternatives(selectedExerciseName);
                const fetchedVariations = await fetchVariations(selectedExerciseName);
                setAlternatives(fetchedAlternatives);
                setVariations(fetchedVariations);
            }
        }
    };

    const renderAlternativesAndVariations = () => {
        return (
            <div className="alternatives-variations">
                <hr></hr>
                <div className="alternatives-h2">
                    <h2>Alternatives</h2>
                </div>
                <div className="alternatives-grid">
                    {alternatives.length > 0 ? (
                        alternatives.map((alt) => (
                            <div 
                                key={alt._id} 
                                className="alternative-box" 
                                onClick={() => handleAltVarClick(alt.name)}
                            >
                                {alt.name}
                            </div>
                        ))
                    ) : (
                        <div className="no-data-message">No alternatives available.</div>
                    )}
                </div>
                <hr></hr>
                <div className="variations-h2">
                    <h2>Variations</h2>
                </div>
                <div className="variations-grid">
                    {variations.length > 0 ? (
                        variations.map((varia) => (
                            <div 
                                key={varia._id} 
                                className="variation-box" 
                                onClick={() => handleAltVarClick(varia.name)}
                            >
                                {varia.name}
                            </div>
                        ))
                    ) : (
                        <div className="no-data-message">No variations available.</div> 
                    )}
                </div>
            </div>
        );
    };

    const handleAltVarClick = async (exerciseName: string) => {
        const fetchedDetails = await fetchExerciseDetails(exerciseName);
        if (fetchedDetails) {
            setSelectedExerciseDetails({
                name: fetchedDetails.name,
                bodyPart: fetchedDetails.bodyPart,
                target: fetchedDetails.muscles.Target.map((muscle: Muscle) => muscle.name).join(', '),
                synergist: fetchedDetails.muscles.Synergist.map((muscle: Muscle) => muscle.name).join(', '),
                stabilizer: fetchedDetails.muscles.Stabilizer.map((muscle: Muscle) => muscle.name).join(', '),
                instructions: fetchedDetails.instructions,
                alternatives: fetchedDetails.alternatives,
                variations: fetchedDetails.variations,
            });
            setShowPopup(true);
        }
    };

    return (
        <div>
            <div className="day-navigation">
                {renderDayButtons()}
            </div>
            {renderExercises()} 
            {showPopup && selectedExerciseDetails && (
                <ExercisePopup
                    exerciseName={selectedExerciseDetails.name}
                    bodyPart={selectedExerciseDetails.bodyPart}
                    target={selectedExerciseDetails.target}
                    synergist={selectedExerciseDetails.synergist}
                    stabilizer={selectedExerciseDetails.stabilizer}
                    details={selectedExerciseDetails}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default ShufflePlan;
