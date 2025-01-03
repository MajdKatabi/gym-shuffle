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
        alternatives: { name: string; _id: string }[];
        variations: { name: string; _id: string }[];
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
        const searchQuery = `${exerciseName} form`;
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
                <h3>Instructions</h3>
                <ol>
                    {details.instructions.map((instruction, index) => (
                        <li key={index}>{instruction.description}</li>
                    ))}
                </ol>
                <h3>Alternatives</h3>
                {details.alternatives.length > 0 ? (
                    <ul>
                        {details.alternatives.map((alt) => (
                            <li key={alt._id}>{alt.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No alternatives</p>
                )}
                <h3>Variations</h3>
                {details.variations.length > 0 ? (
                    <ul>
                        {details.variations.map((varia) => (
                            <li key={varia._id}>{varia.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No variations</p>
                )}
                <div className="help-links">
                    <button onClick={() => handleSearch('video')}>Watch Videos</button>
                    <button onClick={() => handleSearch('image')}>See Images</button>
                </div>
            </div>
        </div>
    );
};

export default ExercisePopup;
