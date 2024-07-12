// src/components/user_account_page/TimeManagementModal/SleepLogPopup/SleepLogPopup.js
import React from 'react';
import './SleepLogPopup.css';

const SleepLogPopup = ({ log, onClose }) => {
    return (
        <div className="sleep-log-popup">
            <div className="sleep-log-popup-content">
                <span className="sleep-log-close" onClick={onClose}>&times;</span>
                <h2>Sleep Log Details</h2>
                <p><strong>Date:</strong> {log.date}</p>
                <p><strong>Sleep Time:</strong> {new Date(log.sleep_time).toLocaleTimeString()}</p>
                <p><strong>Wake Time:</strong> {new Date(log.wake_time).toLocaleTimeString()}</p>
            </div>
        </div>
    );
};

export default SleepLogPopup;
