import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Notes/notes.css';
const apiUrl = process.env.REACT_APP_API_URL;

function AddNoteModal({ user, onClose }) {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [priority, setPriority] = useState('');

    const handleAddNote = async () => {
        if (!title.trim()) {
            alert("Title is required.");
            return;
        }
        if (!note.trim()) {
            alert("Note content is required.");
            return;
        }
        if (!priority) {
            alert("Priority must be selected.");
            return;
        }
        
        try {
            const response = await axios.post(`${apiUrl}/notes/`, {
                user_id: user.id,
                title,
                note,
                priority,
                date: new Date().toISOString().slice(0, 10) // Ensure date is correctly formatted
            });

            if (response.status === 201) {
                alert('Note added successfully!');
                onClose(); // Close the modal after adding the note
            } else {
                alert('Failed to add note. Please try again.');
            }
        } catch (error) {
            console.error('Error adding note:', error);
            alert('An error occurred while adding the note. Please try again later.');
        }
    };

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

    const style = {
        padding: "20px",
        background: '#f8f9fa',
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "700px",
        margin: "auto",
        overflow: "hidden",
        animation: "formAnimation 0.3s ease-out",
        position: "relative",
        marginTop: '5%'
    }
    
    
    return (
        <div className="modal">
            <div className="modal-content" style={style}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add New Note</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '10px',
                        boxSizing: 'border-box',
                        resize: 'both'  // Allow resizing both vertically and horizontally
                    }}
                />
                <div className="select-container" style={{marginTop: "10px"}}>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="">Select Priority</option>
                        <option value="High Priority">High Priority</option>
                        <option value="Medium Priority">Medium Priority</option>
                        <option value="Low Priority">Low Priority</option>
                    </select>
                </div>
                <button onClick={handleAddNote}>Add Note</button>
            </div>
        </div>
    );
}

export default AddNoteModal;
