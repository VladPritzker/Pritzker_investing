import React, { useState } from 'react';

function UpdateMeetingModal({ user, meeting, onClose, onUpdate }) {
    const [title, setTitle] = useState(meeting.title);
    const [datetime, setDatetime] = useState(meeting.datetime);
    const [done, setDone] = useState(meeting.done);

    const handleSaveClick = async () => {
        const updatedMeeting = { ...meeting, title, datetime, done };

        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/meetings/${meeting.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedMeeting)
            });

            if (response.ok) {
                onUpdate(updatedMeeting);
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Failed to update meeting: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            alert(`Network error: ${error.message}`);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content" style={{marginTop: '10%'}}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Meeting</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                />
                <label>
                    Done:
                    <input
                        type="checkbox"
                        checked={done}
                        onChange={(e) => setDone(e.target.checked)}
                    />
                </label>
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default UpdateMeetingModal;
