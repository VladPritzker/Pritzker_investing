import React from 'react';
import '../TimeManagementModal/TimeManagementModal.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const SleepLogsModal = ({ sleepLogs, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="sleep-logs-modal">
                <i className="fas fa-times modal-close" onClick={onClose}></i>
                <h2>Time Management</h2>
                <div className="sleep-logs">
                    {sleepLogs.map(log => (
                        <div key={log.id} className="sleep-log-entry">
                            <p><strong>Date:</strong> {log.date}</p>
                            <p><strong>Sleep Time:</strong> {new Date(log.sleep_time).toLocaleString()}</p>
                            <p><strong>Wake Time:</strong> {new Date(log.wake_time).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SleepLogsModal;
