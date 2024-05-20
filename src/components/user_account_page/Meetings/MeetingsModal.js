import React, { useState, useEffect } from 'react';
import '../Meetings/MeetingsModal.css';
import AddMeetingModal from './AddMeeting/AddMeeting';
import UpdateMeetingModal from './UpdateMeeting/UpdateMeeting';
import ConfirmDeleteMeetingModal from './ComfirmDeleteMeeting/ComfirmDeleteMeeting';

function MeetingsModal({ user, onClose }) {
    const [meetings, setMeetings] = useState([]);
    const [editMeeting, setEditMeeting] = useState(null);
    const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
    const [showUpdateMeetingModal, setShowUpdateMeetingModal] = useState(false);
    const [showConfirmDeleteMeetingModal, setShowConfirmDeleteMeetingModal] = useState(false);
    const [meetingToDelete, setMeetingToDelete] = useState(null);
    const [filters, setFilters] = useState({ title: '', done: '', date: '' });

    const fetchMeetings = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/meetings/`);
            if (response.ok) {
                const data = await response.json();
                setMeetings(data);
            } else {
                console.error('Failed to fetch meetings');
            }
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, [user.id]);

    const handleEditClick = (meeting) => {
        setEditMeeting(meeting);
        setShowUpdateMeetingModal(true);
    };

    const handleAddMeetingClick = () => {
        setShowAddMeetingModal(true);
    };

    const handleSaveNewMeeting = (newMeeting) => {
        setMeetings([...meetings, newMeeting]);
    };

    const handleUpdateMeeting = async (updatedMeeting) => {
        await fetchMeetings();
        setShowUpdateMeetingModal(false);
    };

    const handleDeleteClick = (meetingId) => {
        setMeetingToDelete(meetingId);
        setShowConfirmDeleteMeetingModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/meetings/${meetingToDelete}/`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setMeetings(meetings.filter(meeting => meeting.id !== meetingToDelete));
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
        setFilters({ title: '', done: '', date: '' });
    };

    const handleDoneToggle = async (meeting) => {
        const updatedMeeting = { ...meeting, done: !meeting.done };
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/meetings/${meeting.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ done: updatedMeeting.done })
            });
            if (response.ok) {
                setMeetings(meetings.map(m => (m.id === meeting.id ? updatedMeeting : m)));
            } else {
                console.error('Failed to update meeting');
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

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="modal">
            <div  style={{marginTop: '10%'}} className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Meetings</h2>
                <div className="filter-container">
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
                    <button onClick={clearFilters}>Clear Filters</button>
                </div>
                <button onClick={handleAddMeetingClick}>Add New Meeting</button>
                {filteredMeetings.length > 0 ? (
                    <ul>
                        {filteredMeetings.map(meeting => (
                            <li key={meeting.id} style={{marginLeft: '20%'}} className="meeting-item">
                                <tr className="meeting-details" >
                                    <td><strong style={{marginLeft: '1%'}}>Title:</strong> {meeting.title}</td>
                                    <td><strong style={{marginLeft: '1%'}}>Date & Time:</strong> {new Date(meeting.datetime).toLocaleString()}</td>
                                    <td>
                                        <strong style={{marginLeft: '1%'}}>Done:</strong>                                       
                                    </td>                                    
                                    <td style={{marginLeft: '10%'}}>
                                        <input style={{display: 'inline'}}
                                            type="checkbox"
                                            checked={meeting.done}
                                            onChange={() => handleDoneToggle(meeting)}
                                        />
                                    </td>
                                        
                                </tr>
                                <div style={{marginTop: '5%', marginBottom: '5%'}} className="meeting-actions">
                                    <button onClick={() => handleEditClick(meeting)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(meeting.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No meetings found.</p>
                )}
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
            </div>
        </div>
    );
}

export default MeetingsModal;
