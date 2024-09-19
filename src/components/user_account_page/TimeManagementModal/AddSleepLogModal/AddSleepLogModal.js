import React, { useState, useEffect } from 'react';
import '../TimeManagementModal.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
const apiUrl = process.env.REACT_APP_API_URL;

const AddSleepLogModal = ({ userId, onClose, onSave }) => {
    const [wakeUpTime, setWakeUpTime] = useState('');
    const [sleepTime, setSleepTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleSave = async () => {
        const newLog = {
            date,
            sleep_time: `${date}T${sleepTime}:00`,
            wake_time: `${date}T${wakeUpTime}:00`
        };

        try {
            const response = await fetch(`${apiUrl}/sleeplogs/${userId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLog),
            });

            if (response.ok) {
                const savedLog = await response.json();
                onSave(savedLog);
                setDate('');
                setWakeUpTime('');
                setSleepTime('');
                onClose();
            } else {
                console.error('Failed to save sleep log');
            }
        } catch (error) {
            console.error('Error saving sleep log:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="sleep-logs-modal">
                <i className="fas fa-times modal-close" onClick={onClose}></i>
                <h2>Add New Sleep Log</h2>
                <div className="time-input">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />                    
                    <label>Wake Up Time:</label>
                    <input
                        type="time"
                        value={wakeUpTime}
                        onChange={(e) => setWakeUpTime(e.target.value)}
                    />
                    <label>Sleep Time:</label>
                    <input
                        type="time"
                        value={sleepTime}
                        onChange={(e) => setSleepTime(e.target.value)}
                    />
                    <div className='addLogButtons'>
                        <button onClick={handleSave} className="save-button">Save</button>
                        <button onClick={onClose} className="cancel-button">Cancel</button>                        
                    </div>                    
                </div>
            </div>
        </div>
    );
};

export default AddSleepLogModal;
