import React, { useState, useEffect, useCallback } from 'react';
import './MeetingsModal.css';
import AddMeetingModal from './AddMeeting/AddMeeting';
import UpdateMeetingModal from './UpdateMeeting/UpdateMeeting';
import ConfirmDeleteMeetingModal from './ComfirmDeleteMeeting/ComfirmDeleteMeeting';
import MeetingsCalendar from './MeetingsCalendar/MeetingsCalendar';
const apiUrl = process.env.REACT_APP_API_URL;

function MeetingsModal({ user, onClose }) {
    const [meetings, setMeetings] = useState([]);
    const [editMeeting, setEditMeeting] = useState(null);
    const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
    const [showUpdateMeetingModal, setShowUpdateMeetingModal] = useState(false);
    const [showConfirmDeleteMeetingModal, setShowConfirmDeleteMeetingModal] = useState(false);
    const [meetingToDelete, setMeetingToDelete] = useState(null);
    const [filters, setFilters] = useState({ title: '', done: 'false', date: '' });
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const fetchMeetings = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/meetings/${user.id}/`);
            if (response.ok) {
                const data = await response.json();
                setMeetings(data);
            } else {
                console.error('Failed to fetch meetings');
            }
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    }, [user.id]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const handleEditClick = (meeting) => {
        setEditMeeting(meeting);
        setShowUpdateMeetingModal(true);
    };

    const handleAddMeetingClick = () => {
        setShowAddMeetingModal(true);
    };

    const handleSaveNewMeeting = (newMeeting) => {
        setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
    };

    const handleUpdateMeeting = async (updatedMeeting) => {
        setMeetings(prevMeetings => prevMeetings.map(meeting =>
            meeting.id === updatedMeeting.id ? updatedMeeting : meeting));
        setShowUpdateMeetingModal(false);
    };

    const handleDeleteClick = (meetingId) => {
        setMeetingToDelete(meetingId);
        setShowConfirmDeleteMeetingModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${apiUrl}/meetings/${user.id}/${meetingToDelete}/`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== meetingToDelete));
                setShowConfirmDeleteMeetingModal(false);
            } else {
                console.error('Failed to delete meeting');
            }
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const clearFilters = () => {
        setFilters({ title: '', done: 'false', date: '' });
    };

    const handleDoneToggle = async (meeting) => {
        const updatedMeeting = { ...meeting, done: !meeting.done };
        console.log("Sending updated meeting data:", updatedMeeting);
        try {
            const response = await fetch(`${apiUrl}/meetings/${user.id}/${meeting.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ done: updatedMeeting.done })
            });
            const responseData = await response.json();
            console.log("Response data:", responseData);
            if (response.ok) {
                setMeetings(prevMeetings => prevMeetings.map(m => (m.id === meeting.id ? updatedMeeting : m)));
            } else {
                console.error('Failed to update meeting:', responseData);
            }
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    const filteredMeetings = meetings.filter(meeting => {
        const matchesTitle = meeting.title.toLowerCase().includes(filters.title.toLowerCase());
        const matchesDone = filters.done === '' || (filters.done === 'true' && meeting.done) || (filters.done === 'false' && !meeting.done);
        const matchesDate = filters.date === '' || meeting.datetime.startsWith(filters.date);
        return matchesTitle && matchesDone && matchesDate;
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const formatDateTime = (datetime) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        return new Date(datetime).toLocaleString('en-US', options);
    };

    const handleTitleClick = (meeting) => {
        setSelectedMeeting(meeting);
    };

    const handleClosePopup = () => {
        setSelectedMeeting(null);
    };

    useEffect(() => {
        if (selectedMeeting) {
            const popup = document.querySelector('.meetings-popup-content');
            let isResizing = false;

            const onMouseDown = (e) => {
                isResizing = true;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                if (isResizing) {
                    const width = e.clientX - popup.getBoundingClientRect().left;
                    const height = e.clientY - popup.getBoundingClientRect().top;
                    popup.style.width = `${width}px`;
                    popup.style.height = `${height}px`;
                }
            };

            const onMouseUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            const resizeHandle = popup.querySelector('.custom-handle-meetings');
            resizeHandle.addEventListener('mousedown', onMouseDown);

            return () => {
                resizeHandle.removeEventListener('mousedown', onMouseDown);
            };
        }
    }, [selectedMeeting]);

    return (
        <div className="meetings-modal">
            <div className="meetings-modal-content">
                <span className="meetings-close" onClick={onClose}>&times;</span>
                <h2>Meetings</h2>
                <div className="meetings-filters">
                    <input
                        type="text"
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                        placeholder="Filter by title"
                    />
                    <select name="done" value={filters.done} onChange={handleFilterChange}>
                        <option value="">Filter by done status</option>
                        <option value="true">Done</option>
                        <option value="false">Not Done</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        placeholder="Filter by date"
                    />
                    <button className="clear-filters" onClick={clearFilters}>Clear Filters</button>
                </div>
                <button className="add-meeting" onClick={handleAddMeetingClick}>Add New Meeting</button>
                <div className="meetings-list-container">
                    {filteredMeetings.length > 0 ? (
                        <ul>
                            {filteredMeetings.map(meeting => (
                                <li key={meeting.id} className="meetings-meeting-item">
                                    <div className="meetings-meeting-details">
                                        <div>
                                            <strong>Title:</strong>
                                            <span onClick={() => handleTitleClick(meeting)}>
                                                {meeting.title.length > 20 ? `${meeting.title.substring(0, 20)}...` : meeting.title}
                                            </span>
                                        </div>
                                        <div><strong>Date & Time:</strong> {formatDateTime(meeting.datetime)}</div>
                                        <div>
                                            <strong>Done:</strong>
                                            <input
                                                type="checkbox"
                                                checked={meeting.done}
                                                onChange={() => handleDoneToggle(meeting)}
                                            />
                                        </div>
                                    </div>
                                    <div className="meetings-meeting-actions">
                                        <button className="edit-meeting" onClick={() => handleEditClick(meeting)}>Edit</button>
                                        <button className="delete-meeting" onClick={() => handleDeleteClick(meeting.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No meetings found.</p>
                    )}
                </div>
                {showAddMeetingModal && (
                    <AddMeetingModal
                        user={user}
                        onClose={() => setShowAddMeetingModal(false)}
                        onSave={handleSaveNewMeeting}
                    />
                )}
                {showUpdateMeetingModal && editMeeting && (
                    <UpdateMeetingModal
                        user={user}
                        meeting={editMeeting}
                        onClose={() => setShowUpdateMeetingModal(false)}
                        onUpdate={handleUpdateMeeting}
                    />
                )}
                {showConfirmDeleteMeetingModal && (
                    <ConfirmDeleteMeetingModal
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowConfirmDeleteMeetingModal(false)}
                    />
                )}
                <MeetingsCalendar meetings={filteredMeetings} />
                {selectedMeeting && (
                    <div className="meetings-popup">
                        <div className="meetings-popup-content">
                            <span className="meetings-close" onClick={handleClosePopup}>&times;</span>
                            <h2>{selectedMeeting.title}</h2>
                            <p><strong>Date & Time:</strong> {formatDateTime(selectedMeeting.datetime)}</p>
                            <p><strong>Done:</strong> {selectedMeeting.done ? 'Yes' : 'No'}</p>
                            <span className="custom-handle-meetings" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MeetingsModal;
