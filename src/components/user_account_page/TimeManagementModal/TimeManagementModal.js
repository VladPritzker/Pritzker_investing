// src/components/user_account_page/TimeManagementModal/SleepLogsModal.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../TimeManagementModal/TimeManagementModal.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DeleteConfirmationModal from './DeleteModalSleepLogs/DeleteModal';
import AddSleepLogModal from '../TimeManagementModal/AddSleepLogModal/AddSleepLogModal';
import ChartModal from './ChartModal/ChartModal';
import SleepLogPopup from './SleepLogPopup/SleepLogPopup';

const SleepLogsModal = ({ userId, sleepLogs, setSleepLogs, onClose, onDelete }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLogId, setDeleteLogId] = useState(null);
    const [editLogId, setEditLogId] = useState(null);
    const [editSleepLogDetails, setEditSleepLogDetails] = useState({
        date: '',
        sleep_time: '',
        wake_time: ''
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        const fetchSleepLogs = async () => {
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

    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/sleeplogs/${userId}/${editLogId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: editSleepLogDetails.date,
                    sleep_time: `${editSleepLogDetails.date}T${editSleepLogDetails.sleep_time}:00`,
                    wake_time: `${editSleepLogDetails.date}T${editSleepLogDetails.wake_time}:00`,
                }),
            });
            if (response.ok) {
                const updatedLog = await response.json();
                setSleepLogs(prevLogs =>
                    prevLogs.map(log => (log.id === editLogId ? updatedLog : log))
                );
                setEditLogId(null);
                setEditSleepLogDetails({
                    date: '',
                    sleep_time: '',
                    wake_time: ''
                });
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

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/sleeplogs/${userId}/${deleteLogId}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSleepLogs(prevLogs => prevLogs.filter(log => log.id !== deleteLogId));
                setIsDeleteModalOpen(false);
                setDeleteLogId(null);
            } else {
                console.error('Failed to delete sleep log');
            }
        } catch (error) {
            console.error('Error deleting sleep log:', error);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteLogId(null);
    };

    const handleEdit = (log) => {
        setEditSleepLogDetails({
            date: log.date,
            sleep_time: log.sleep_time.substring(11, 16),
            wake_time: log.wake_time.substring(11, 16)
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

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleSaveNewLog = (newLog) => {
        setSleepLogs(prevLogs => [...prevLogs, newLog]);
    };

    const handleOpenChartModal = () => {
        setIsChartModalOpen(true);
    };

    const handleCloseChartModal = () => {
        setIsChartModalOpen(false);
    };

    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const log = sleepLogs.find(log => new Date(log.date).toDateString() === date.toDateString());
            if (log) {
                const sleepTime = new Date(log.sleep_time);
                const wakeTime = new Date(log.wake_time);
    
                const sleepHours = sleepTime.getHours();
                const sleepMinutes = sleepTime.getMinutes();
                const wakeHours = wakeTime.getHours();
                const wakeMinutes = wakeTime.getMinutes();
    
                // Check if sleep time is after 22:00 or before 06:00
                const isSleepTimeLate = (sleepHours > 22 || (sleepHours === 22 && sleepMinutes > 0)) || (sleepHours < 6);
    
                // Check if wake time is after 06:00
                const isWakeTimeEarly = (wakeHours > 6 || (wakeHours === 6 && wakeMinutes > 0));
    
                const iconColor = isSleepTimeLate && isWakeTimeEarly ? 'red' : 'green';
    
                return (
                    <i
                        className="fas fa-bed sleep-log-icon"
                        style={{ color: iconColor }} // Set icon color
                        onClick={() => setSelectedLog(log)} // Set the selected log on click
                    />
                );
            }
        }
        return null;
    };
    

    return (
        <div className="modal-overlay">
            <div className="sleep-logs-modal">
                <i className="fas fa-times modal-close" onClick={onClose}></i>
                <h2>Time Management</h2>
                <div className="button-container">
                    <button onClick={handleOpenAddModal} className="add-button">Add New Log</button>
                    <button onClick={handleOpenChartModal} className="chart-button">Chart</button>
                </div>
                <Calendar
                    value={new Date(currentYear, currentMonth)}
                    tileContent={renderTileContent}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        setCurrentMonth(activeStartDate.getMonth());
                        setCurrentYear(activeStartDate.getFullYear());
                    }}
                />
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
                                        <div className='addLogButtons'>
                                            <button onClick={handleSave} className="save-button">Save</button>
                                            <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p><strong>Date:</strong> {log.date}</p>
                                        <p><strong>Sleep Time:</strong> {new Date(log.sleep_time).toLocaleTimeString()}</p>                                    
                                        <p><strong>Wake Time:</strong> {new Date(log.wake_time).toLocaleTimeString()}</p>
                                        <div className='addLogButtons'>
                                            <button onClick={() => handleEdit(log)} className="edit-button">Edit</button>
                                            <button onClick={() => handleDelete(log.id)} className="delete-button">Delete</button>
                                        </div>
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
            {isAddModalOpen && (
                <AddSleepLogModal
                    userId={userId}
                    onClose={handleCloseAddModal}
                    onSave={handleSaveNewLog}
                />
            )}
            {isChartModalOpen && (
                <ChartModal
                    sleepLogs={sleepLogs}
                    onClose={handleCloseChartModal}
                />
            )}
            {selectedLog && (
                <SleepLogPopup
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            )}
        </div>
    );
};

export default SleepLogsModal;
