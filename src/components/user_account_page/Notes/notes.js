import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../InvestingModal/InvestingModal.css';

const priorityOptions = [
  { id: 1, type: "High Priority" },
  { id: 2, type: "Medium Priority" },
  { id: 3, type: "Low Priority" }
];

function NotesModal({ user, onClose }) {
    const [notes, setNotes] = useState([]);
    const [showHiddenNotes, setShowHiddenNotes] = useState(false);
    const [filters, setFilters] = useState({
        title: '',
        dateFrom: '',
        dateTo: '',
        priority: ''
    });

    useEffect(() => {
        fetchNotes();
    }, [filters, showHiddenNotes, user.id]);

    const fetchNotes = async () => {
        const params = new URLSearchParams({
            ...filters,
            user_id: user.id
        }).toString();

        try {
            const response = await axios.get(`http://127.0.0.1:8000/notes/?${params}`);
            if (response.status === 200) {
                const visibleNotes = response.data.filter(note => showHiddenNotes || !note.hide);
                setNotes(visibleNotes);
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    const toggleNoteVisibility = async (noteId, hideStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${noteId}/`, { hide: !hideStatus });
            fetchNotes(); // Refresh list to reflect changes
        } catch (error) {
            console.error('Error updating note visibility:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox' && name === 'showHiddenNotes') {
            setShowHiddenNotes(checked);
        } else {
            setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Notes List</h2>
                <div className="filters">
                    <input type="text" name="title" placeholder="Filter by title" value={filters.title} onChange={handleChange} />
                    <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} />
                    <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} />
                    <select name="priority" value={filters.priority} onChange={handleChange}>
                        <option value="">All Priorities</option>
                        {priorityOptions.map(option => (
                            <option key={option.id} value={option.type}>{option.type}</option>
                        ))}
                    </select>
                    <label>
                        Show Hidden Notes
                        <input type="checkbox" checked={showHiddenNotes} onChange={handleChange} name="showHiddenNotes" />
                    </label>
                </div>
                <table className="financial-records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Note</th>
                            <th>Date</th>
                            <th>Priority</th>
                            <th>Done</th>
                            <th>Hide</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map(note => (
                            <tr key={note.id}>
                                <td>{note.title}</td>
                                <td>{note.note}</td>
                                <td>{note.date}</td>
                                <td>{note.priority}</td>
                                <td><input type="checkbox" checked={note.done} readOnly /></td>
                                <td>
                                    <input type="checkbox" checked={note.hide} onChange={() => toggleNoteVisibility(note.id, note.hide)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NotesModal;
