import React, { useState } from 'react';

function AddMeetingModal({ user, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [datetime, setDatetime] = useState('');
    const [done, setDone] = useState(false);

    const handleSaveClick = async () => {
        if (title.trim() === '' || datetime.trim() === '') {
            alert('Please ensure all fields are filled out correctly.');
            return;
        }
    
        const meetingData = {
            user_id: user.id,
            title,
            datetime: new Date(datetime).toISOString(),  // Ensure datetime is in ISO format
            done
        };
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/meetings/${user.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meetingData)
            });
    
            if (response.ok) {
                const newMeeting = await response.json();
                onSave(newMeeting);
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Failed to add meeting: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            alert(`Network error: ${error.message}`);
        }
    };
    
    
    return (
        <div className="modal">
            <div className="modal-content" style={{ marginTop: '10%' }}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add New Meeting</h2>
                <input
                    type="text"
                    placeholder="Meeting Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="Date and Time"
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

export default AddMeetingModal;
