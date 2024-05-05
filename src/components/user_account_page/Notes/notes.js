import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../InvestingModal/InvestingModal.css';

const priorityOptions = [
  { id: 1, type: "High Priority" },
  { id: 2, type: "Medium Priority" },
  { id: 3, type: "Low Priority" }
];

function NotesModal({ user, onClose }) {
    const [notesData, setNotesData] = useState([]);
    const [filters, setFilters] = useState({
        title: '',
        dateFrom: '',
        dateTo: '',
        priority: '',
        done: false,
        hide: false
    });
    const [showHidden, setShowHidden] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            const queryParams = new URLSearchParams({
                ...filters,
                user_id: user.id
            });
            try {
                const response = await axios.get(`http://127.0.0.1:8000/notes/?${queryParams}`);
                const notes = response.data.map(note => ({
                    ...note,
                    done: note.done === 1,
                    hide: note.hide === 1
                }));
                // Filter notes based on the "showHidden" flag and the priority filter
                const filteredNotes = notes.filter(note => 
                    (filters.hide === note.hide) &&
                    (filters.priority === '' || note.priority === filters.priority)
                );
                setNotesData(filteredNotes);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [filters, user.id, showHidden]); // Include showHidden in the dependency array

    const toggleDone = async (noteId, doneStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${noteId}/`, { done: !doneStatus });
            setNotesData(prev => prev.map(note => note.id === noteId ? { ...note, done: !doneStatus } : note));
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const toggleHide = async (noteId, hideStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${noteId}/`, { hide: !hideStatus });
            setNotesData(prev => prev.map(note => note.id === noteId ? { ...note, hide: !hideStatus } : note));
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'hide') {
            setShowHidden(checked);
        } else {
            setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Notes List</h2>
                <div className="filters">
                    <input type="text" name="title" placeholder="Filter by title" value={filters.title} onChange={handleChange} />
                    <input type="date" name="dateFrom" placeholder="From date" value={filters.dateFrom} onChange={handleChange} />
                    <input type="date" name="dateTo" placeholder="To date" value={filters.dateTo} onChange={handleChange} />
                    <select name="priority" value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})}>
                        <option value="">Select Priority</option>
                        {priorityOptions.map(option => (
                            <option key={option.id} value={option.type}>{option.type}</option>
                        ))}
                    </select>
                    <label>
                        Show Hidden Notes
                        <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} name="hide" />
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
                        {notesData.map(note => (
                            <tr key={note.id}>
                                <td>{note.title}</td>
                                <td>{note.note}</td>
                                <td>{note.date}</td>
                                <td>{note.priority}</td>
                                <td><input type="checkbox" checked={note.done} onChange={() => toggleDone(note.id, note.done)} /></td>
                                <td><input type="checkbox" checked={note.hide} onChange={() => toggleHide(note.id, note.hide)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NotesModal;
