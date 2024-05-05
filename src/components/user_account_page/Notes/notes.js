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
    const [titleFilter, setTitleFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showHidden, setShowHidden] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [titleFilter, dateFromFilter, dateToFilter, priorityFilter, showHidden, user.id]);

    const fetchNotes = async () => {
        const queryParams = new URLSearchParams({
            user_id: user.id,
            title: titleFilter,
            dateFrom: dateFromFilter,
            dateTo: dateToFilter,
            priority: priorityFilter
        });
        try {
            const response = await axios.get(`http://127.0.0.1:8000/notes/?${queryParams}`);
            const notes = response.data.map(note => ({
                ...note,
                done: note.done === 1,
                hide: note.hide === 1
            }));
            updateNotesDisplay(notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const updateNotesDisplay = (notes) => {
        let filteredNotes = notes.filter(note => 
            (priorityFilter === '' || note.priority === priorityFilter) && 
            (showHidden || !note.hide)
        );
        setNotesData(filteredNotes);
    };

    const toggleDone = async (noteId, doneStatus) => {
        
        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${noteId}/`, { done: !doneStatus });
            
            setNotesData(notesData.map(note => 
                note.id === noteId ? {...note, done: !note.done} : note
            ));
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const toggleHide = async (noteId, hideStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/notes/${user.id}/${noteId}/`, { hide: !hideStatus });
            // Update notesData locally and conditionally filter notes based on hide status
            setNotesData(prevNotes => {
                // Update the hide status of the specific note
                const updatedNotes = prevNotes.map(note => 
                    note.id === noteId ? { ...note, hide: !hideStatus } : note
                );
    
                // If 'showHidden' is false, filter out the hidden notes, otherwise show all
                return showHidden ? updatedNotes : updatedNotes.filter(note => !note.hide);
            });
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        switch (name) {
            case 'title':
                setTitleFilter(value);
                break;
            case 'dateFrom':
                setDateFromFilter(value);
                break;
            case 'dateTo':
                setDateToFilter(value);
                break;
            case 'priority':
                setPriorityFilter(value);
                break;
            case 'hide':
                setShowHidden(checked);
                break;
            default:
                break;
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Notes List</h2>
                <div className="filters">
                    <input type="text" name="title" placeholder="Filter by title" value={titleFilter} onChange={handleChange} />
                    <input type="date" name="dateFrom" placeholder="From date" value={dateFromFilter} onChange={handleChange} />
                    <input type="date" name="dateTo" placeholder="To date" value={dateToFilter} onChange={handleChange} />
                    <select name="priority" value={priorityFilter} onChange={handleChange}>
                        <option value="">Select Priority</option>
                        {priorityOptions.map(option => (
                            <option key={option.id} value={option.type}>{option.type}</option>
                        ))}
                    </select>
                    <label>
                        Show Hidden Notes
                        <input type="checkbox" checked={showHidden} onChange={handleChange} name="hide" />
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
