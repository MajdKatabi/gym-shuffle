import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ShufflePlan.css';

const ShufflePlan: React.FC = () => {
    const location = useLocation();
    const selectedDay = location.state.selectedDay;
    const [clickedDay, setClickedDay] = useState<number>(1);

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

    return (
        <div>
            { renderDaySelector() }
        </div>
    );
};

export default ShufflePlan;