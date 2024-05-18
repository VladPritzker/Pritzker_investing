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

    const [editNote, setEditNote] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        dateFrom: '',
        dateTo: '',
        priority: ''
    });
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);

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
                // Sort notes by order attribute
                filteredNotes.sort((a, b) => a.order - b.order);
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
        setEditNote({
            ...note,
            isEditing: true,
        });
    };

    

    const handleAddNoteClose = () => {
        setShowAddNoteModal(false);
        fetchNotes(); // Refresh notes list after adding a new note
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index) => {
        if (draggedIndex === index) return;

        const updatedNotes = [...notes];
        const draggedItem = updatedNotes[draggedIndex];
        updatedNotes.splice(draggedIndex, 1);
        updatedNotes.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setNotes(updatedNotes);
    };

    const handleDragEnd = async () => {
        setDraggedIndex(null);
        const updatedNotes = notes.map((note, index) => ({ ...note, order: index + 1 }));
        setNotes(updatedNotes);

        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/reorder/`, updatedNotes);
        } catch (error) {
            console.error('Error updating note order:', error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditNote(prevNote => ({
            ...prevNote,
            [name]: value,
        }));
    };

    const saveNoteDetails = async () => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${editNote.id}/`, editNote);
            setEditNote(null);
            fetchNotes();
        } catch (error) {
            console.error('Failed to save note details:', error);
        }
    };
    

    const cancelEdit = () => {
        setEditNote(null);
    };
    const style = {
        padding: "20px",
        background: '#f8f9fa',
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "900px",
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
                <h2>Tasks List </h2>
                <div className="filters">
                    <input type="text" name="title" placeholder="Filter by title" value={filters.title} onChange={handleChange} />
                    <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} />
                    <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} />
                    <div className="filter-row" style={{ display: "-webkit-box" }}>
                        <div style={{ width: '100%', display: 'ruby' }} className="select-container">
                            <select name="priority" value={filters.priority} onChange={handleChange}>
                                <option value="">All Priorities</option>
                                {priorityOptions.map(option => (
                                    <option key={option.id} value={option.type}>{option.type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="custom-checkbox">
                            <label style={{ display: 'ruby', width: '80%' }}>
                                <div style={{ width: '300px', marginTop: '20px', marginLeft: '-40px' }}>Show Hidden Tasks</div>
                                <input style={{ width: '30px', padding: '10px', marginLeft: '-30px', marginTop: '20px' }} type="checkbox" checked={showHiddenNotes} onChange={handleChange} name="showHiddenNotes" />
                            </label>
                        </div>
                        <button style={{ marginBottom: '10px' }} onClick={() => setShowAddNoteModal(true)}>Add Task</button>
                        <button style={{ marginTop: '10px', width: '150px' }} className="clear-filters" onClick={clearFilters}>Clear Filters</button>
                    </div>
                </div>
                <table className="financial-records-table">
                <p>
                (Tasks displayed {notes.length} )
                </p>
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
                    <tbody style={{ marginLeft: '-15px' }}>
                        {notes.map((note, index) => (
                            <tr
                                key={note.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => e.preventDefault()}  // Allow the row to be a drop target
                                onDrop={() => handleDragOver(index)}  // Handle dropping the row
                                onDragEnd={handleDragEnd}
                            >
                                <td onClick={() => handleNoteClick(note)}>{note.title}</td>
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
            {editNote && (
                <div className="note-details-modal">
                    <h4>Edit Task</h4>
                    <div>
                        <label>
                            Title:
                            <input stype="text" name="title" value={editNote.title} onChange={handleEditChange} />
                        </label>
                    </div>
                    <div style={{marginTop: '5%'}}>
                        <label>
                            Note:
                            <textarea    name="note" value={editNote.note} onChange={handleEditChange} />
                        </label>
                    </div>
                    <button style={{width: '95px', padding: '5px 5px 5px 5px'}} onClick={saveNoteDetails}>Save</button>
                    <button style={{width: '95px', padding: '5px 5px 5px 5px'}} onClick={cancelEdit}>Cancel</button>
                </div>
            )}
           
        </div>
    );
}

export default NotesModal;
