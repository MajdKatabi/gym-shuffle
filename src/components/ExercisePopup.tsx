import React from 'react';

interface Instruction {
    order: number;
    description: string;
}

interface ExercisePopupProps {
    exerciseName: string;
    bodyPart: string;
    target: string;
    synergist: string;
    stabilizer: string;
    details: {
        instructions: Instruction[];
    };
    onClose: () => void;
}

const ExercisePopup: React.FC<ExercisePopupProps> = ({
    exerciseName,
    bodyPart,
    target,
    synergist,
    stabilizer,
    details,
    onClose,
}) => {
    const handleSearch = (type: string) => {
        const searchQuery = `${exerciseName} exercise form`;
        if (type === 'video') {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
        } else {
            window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`, '_blank');
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>X</button>
                <div className="exercise-info">
                    <h2>{exerciseName}</h2>
                    <h3>{bodyPart}</h3>
                    {target && <p><strong>Target:</strong> {target}</p>}
                    {synergist && <p><strong>Synergist:</strong> {synergist}</p>}
                    {stabilizer && <p><strong>Stabilizer:</strong> {stabilizer}</p>}
                </div>
                <div className="instructions-info">
                    <h3>Instructions</h3>
                    <ol>
                        {details.instructions.map((instruction, index) => (
                            <li key={index}>{instruction.description}</li>
                        ))}
                    </ol>
                </div>
                <div className="help-links">
                    <button onClick={() => handleSearch('video')}>Watch Videos</button>
                    <button onClick={() => handleSearch('image')}>See Images</button>
                </div>
            </div>
        </div>
    );
};

export default ExercisePopup;
