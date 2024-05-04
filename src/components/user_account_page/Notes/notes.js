import React, { useState, useEffect } from 'react';
import '../InvestingModal/InvestingModal.css'; // Reusing existing CSS for consistency
import priorityOptions from './priorityType.json'; 

function NotesModal({ user, onClose }) {
    const [notesData, setNotesData] = useState([]); // State to hold notes data
    const [filters, setFilters] = useState({
        title: '',
        dateFrom: '',
        dateTo: '',
        priority: '',
        done: '',
        hide: ''
    });
    const [filterType, setFilterType] = useState('');


    useEffect(() => {
        const fetchNotes = async () => {
            const queryParams = new URLSearchParams({
                ...filters,
                user_id: user.id
            });
            try {
                const response = await fetch(`http://127.0.0.1:8000/notes/?${queryParams}`);
                if (response.ok) {
                    const data = await response.json();
                    setNotesData(data); // Set fetched data into notesData
                } else {
                    console.error('Failed to fetch notes.');
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [filters, user.id]); // Dependency on filters to refetch when they change

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked.toString() : e.target.value;
        setFilters(prev => ({ ...prev, [e.target.name]: value }));
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Notes List</h2>
                <div className="filters">
                    <input
                        type="text"
                        name="title"
                        placeholder="Filter by title"
                        value={filters.title}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="dateFrom"
                        placeholder="From date"
                        value={filters.dateFrom}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="dateTo"
                        placeholder="To date"
                        value={filters.dateTo}
                        onChange={handleChange}
                    />                    
                     <div className="select-container">
                        <select value={priorityOptions} onChange={e => setFilterType(e.target.value)}>
                            <option value="">All Types</option>
                            {Object.entries(priorityOptions).map(([type, id]) => (
                                <option key={id} value={id}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <label>
                        <input
                            type="checkbox"
                            name="hide"
                            checked={filters.hide === 'true'}
                            onChange={handleChange}
                        /> Show notes which are Hidden
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
                        </tr>
                    </thead>
                    <tbody>
                        {notesData.map(note => (
                            <tr key={note.id}>
                                <td>{note.title}</td>
                                <td>{note.note}</td>
                                <td>{note.date}</td>
                                <td>{note.priority}</td>
                                <td>{note.done ? 'Done' : 'Not Done'}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NotesModal;
