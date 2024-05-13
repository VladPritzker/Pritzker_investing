import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../InvestingModal/InvestingModal.css';
import AddNote from '../AddNote/addNoteModal';

const priorityOptions = [
    { id: 1, type: "High Priority" },
    { id: 2, type: "Medium Priority" },
    { id: 3, type: "Low Priority" }
];

function NotesModal({ user, onClose }) {
    const [notes, setNotes] = useState([]);
    const [showHiddenNotes, setShowHiddenNotes] = useState(false);
    const [activeNote, setActiveNote] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        dateFrom: '',
        dateTo: '',
        priority: ''
    });
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [filters, showHiddenNotes, user.id]);

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

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/notes/${user.id}/`);
            if (response.status === 200) {
                let filteredNotes = response.data;
                if (filters.title) {
                    filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(filters.title.toLowerCase()));
                }
                if (filters.dateFrom) {
                    filteredNotes = filteredNotes.filter(note => new Date(note.date) >= new Date(filters.dateFrom));
                }
                if (filters.dateTo) {
                    filteredNotes = filteredNotes.filter(note => new Date(note.date) <= new Date(filters.dateTo));
                }
                if (filters.priority) {
                    filteredNotes = filteredNotes.filter(note => note.priority === filters.priority);
                }
                if (!showHiddenNotes) {
                    filteredNotes = filteredNotes.filter(note => !note.hide);
                }
                setNotes(filteredNotes);
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

    const toggleNoteDone = async (noteId, doneStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${noteId}/`, { done: !doneStatus });
            fetchNotes(); // Refresh list to reflect changes
        } catch (error) {
            console.error('Error updating note done status:', error);
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

    const clearFilters = () => {
        setFilters({
            title: '',
            dateFrom: '',
            dateTo: '',
            priority: ''
        });
        setShowHiddenNotes(false);
    };

    const handleNoteClick = (note) => {
        if (note.note.length > 10) {
            setActiveNote(note);
        }
    };

    const closeNoteDetails = () => {
        setActiveNote(null);
    };

    const handleAddNoteClose = () => {
        setShowAddNoteModal(false);
        fetchNotes(); // Refresh notes list after adding a new note
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
                    <button style={{marginBottom: '10px'}} onClick={() => setShowAddNoteModal(true)}>Add note</button>
                    <div className="filter-row" style={{display: "-webkit-box"}}>
                        <div style={{width: '100%', display: 'ruby' }} className="select-container">
                            <select name="priority" value={filters.priority} onChange={handleChange}>
                                <option value="">All Priorities</option>
                                {priorityOptions.map(option => (
                                    <option key={option.id} value={option.type}>{option.type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="custom-checkbox" >
                            <label style={{display: 'ruby', width: '80%'}}>
                                <div style={{width: '300px', marginTop:'20px', marginLeft: '-40px'}}>Show Hidden Notes</div>
                                <input style={{width: '30px',padding: '10px',marginLeft: '-30px',  marginTop:'20px'}} type="checkbox" checked={showHiddenNotes} onChange={handleChange} name="showHiddenNotes" />
                            </label>
                        </div>
                        <button style={{ marginTop:'10px', width: '150px'}} className="clear-filters" onClick={clearFilters}>Clear Filters</button>
                    </div>
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
                    <tbody style={{marginLeft: '-15px'}}>
                        {notes.map(note => (
                            <tr key={note.id}>
                                <td>{note.title}</td>
                                <td onClick={() => handleNoteClick(note)}>
                                    {note.note.length > 10 ? `${note.note.substring(0, 10)}...` : note.note}
                                </td>
                                <td>{note.date}</td>
                                <td>{note.priority}</td>
                                <td><input type="checkbox" checked={note.done} onChange={() => toggleNoteDone(note.id, note.done)} /></td>
                                <td>
                                    <input type="checkbox" checked={note.hide} onChange={() => toggleNoteVisibility(note.id, note.hide)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showAddNoteModal && <AddNote user={user} onClose={handleAddNoteClose} />}
            {activeNote && (
                <div className="note-details-modal">
                    <h4>Full Note</h4>
                    <p>{activeNote.note}</p>
                    <button onClick={closeNoteDetails}>Close</button>
                </div>
            )}
        </div>
    );
}

export default NotesModal;
