// src/components/user_account_page/TimeManagementModal/SleepLogPopup.js
import React from 'react';
import './SleepLogPopup.css';

const SleepLogPopup = ({ log, onClose }) => {
    return (
        <div className="sleep-log-popup-overlay">
            <div className="sleep-log-popup">
                <i className="fas fa-times popup-close" onClick={onClose}></i>
                <h2>Sleep Log Details</h2>
                <p><strong>Date:</strong> {log.date}</p>
                <p><strong>Sleep Time:</strong> {new Date(log.sleep_time).toLocaleTimeString()}</p>
                <p><strong>Wake Time:</strong> {new Date(log.wake_time).toLocaleTimeString()}</p>
            </div>
        </div>
    );
};

export default SleepLogPopup;
