import React, { useState, useEffect } from 'react';
import '../TimeManagementModal/TimeManagementModal.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DeleteConfirmationModal from './DeleteModalSleepLogs/DeleteModal'; // Import the delete confirmation modal

const SleepLogsModal = ({ userId, sleepLogs, setSleepLogs, onClose, onSave, onDelete }) => {
    const [wakeUpTime, setWakeUpTime] = useState('');
    const [sleepTime, setSleepTime] = useState('');
    const [date, setDate] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLogId, setDeleteLogId] = useState(null);
    const [editLogId, setEditLogId] = useState(null);
    const [editSleepLogDetails, setEditSleepLogDetails] = useState({
        date: '',
        sleep_time: '',
        wake_time: ''
    });

    useEffect(() => {
        const fetchSleepLogs = async () => {
            if (userId) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/sleeplogs/${userId}/`);
                    if (response.ok) {
                        const data = await response.json();
                        setSleepLogs(data);
                    } else {
                        console.error('Failed to fetch sleep logs');
                    }
                } catch (error) {
                    console.error('Error fetching sleep logs:', error);
                }
            }
        };

        fetchSleepLogs();
    }, [userId, setSleepLogs]);

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

    const handleSave = () => {
        if (editLogId) {
            handleUpdateSleepLog(editLogId, editSleepLogDetails);
        } else {
            onSave(date, sleepTime, wakeUpTime);
        }
        setDate('');
        setWakeUpTime('');
        setSleepTime('');
        setEditLogId(null);
    };

    const handleUpdateSleepLog = async (logId, details) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/sleeplogs/${userId}/${logId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: details.date,
                    sleep_time: `${details.date} ${details.sleep_time}:00`,
                    wake_time: `${details.date} ${details.wake_time}:00`,
                }),
            });
            if (response.ok) {
                const updatedLog = await response.json();
                setSleepLogs(prevLogs =>
                    prevLogs.map(log => (log.id === logId ? updatedLog : log))
                );
            } else {
                console.error('Failed to update sleep log');
            }
        } catch (error) {
            console.error('Error updating sleep log:', error);
        }
    };

    const handleDelete = (logId) => {
        setDeleteLogId(logId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        onDelete(deleteLogId);
        setIsDeleteModalOpen(false);
        setDeleteLogId(null);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteLogId(null);
    };

    const handleEdit = (log) => {
        setEditSleepLogDetails({
            date: log.date,
            sleep_time: new Date(log.sleep_time).toISOString().substring(11, 16),
            wake_time: new Date(log.wake_time).toISOString().substring(11, 16)
        });
        setEditLogId(log.id);
    };

    const handleCancelEdit = () => {
        setEditLogId(null);
        setEditSleepLogDetails({
            date: '',
            sleep_time: '',
            wake_time: ''
        });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditSleepLogDetails({ ...editSleepLogDetails, [name]: value });
    };

    return (
        <div className="modal-overlay">
            <div className="sleep-logs-modal">
                <i className="fas fa-times modal-close" onClick={onClose}></i>
                <h2>Time Management</h2>
                <div className="time-input">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <label>Sleep Time:</label>
                    <input
                        type="time"
                        value={sleepTime}
                        onChange={(e) => setSleepTime(e.target.value)}
                    />
                    <label>Wake Up Time:</label>
                    <input
                        type="time"
                        value={wakeUpTime}
                        onChange={(e) => setWakeUpTime(e.target.value)}
                    />
                    <button onClick={handleSave} className="save-button">
                        {editLogId ? 'Update' : 'Save'}
                    </button>
                    {editLogId && (
                        <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                    )}
                </div>
                <div className="sleep-logs-container">
                    <div className="sleep-logs">
                        {sleepLogs.map(log => (
                            <div key={log.id} className="sleep-log-entry">
                                {editLogId === log.id ? (
                                    <div className="edit-sleep-log">
                                        <label>Date:</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={editSleepLogDetails.date}
                                            onChange={handleEditInputChange}
                                        />
                                        <label>Sleep Time:</label>
                                        <input
                                            type="time"
                                            name="sleep_time"
                                            value={editSleepLogDetails.sleep_time}
                                            onChange={handleEditInputChange}
                                        />
                                        <label>Wake Up Time:</label>
                                        <input
                                            type="time"
                                            name="wake_time"
                                            value={editSleepLogDetails.wake_time}
                                            onChange={handleEditInputChange}
                                        />
                                        <button onClick={handleSave} className="save-button">Save</button>
                                        <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <p><strong>Date:</strong> {log.date}</p>
                                        <p><strong>Sleep Time:</strong> {new Date(log.sleep_time).toLocaleTimeString()}</p>
                                        <p><strong>Wake Time:</strong> {new Date(log.wake_time).toLocaleTimeString()}</p>
                                        <button onClick={() => handleEdit(log)} className="edit-button">Edit</button>
                                        <button onClick={() => handleDelete(log.id)} className="delete-button">Delete</button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default SleepLogsModal;
