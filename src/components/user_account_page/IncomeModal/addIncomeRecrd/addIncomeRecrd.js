import React, { useState } from 'react';
import '../addIncomeRecrd/addIncomeRecrd.css';
const apiUrl = process.env.REACT_APP_API_URL;

function AddRecordModal({ user, onClose, onRecordAdded }) {
    const [newRecord, setNewRecord] = useState({ title: '', amount: '', record_date: '' });

    const handleAddRecordChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddRecordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/users/${user.id}/income_records/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord),
            });
            if (response.ok) {
                const addedRecord = await response.json();
                onRecordAdded(addedRecord);
                onClose();
            } else {
                throw new Error('Failed to add income record.');
            }
        } catch (error) {
            console.error('Error adding income record:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content" style={{marginTop: '10%'}}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add New Income Record</h2>
                <form onSubmit={handleAddRecordSubmit}>
                    <input type="text" name="title" placeholder="Title" value={newRecord.title} onChange={handleAddRecordChange} required />
                    <input type="number" name="amount" placeholder="Amount" value={newRecord.amount} onChange={handleAddRecordChange} required />
                    <input type="date" name="record_date" value={newRecord.record_date} onChange={handleAddRecordChange} required />
                    <button type="submit">Add Record</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default AddRecordModal;
