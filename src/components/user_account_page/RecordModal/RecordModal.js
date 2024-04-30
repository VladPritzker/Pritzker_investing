import React, { useState } from 'react';
import '../RecordModal/RecordModal.css';

function RecordModal({ user, onClose, onSave }) {
    const [recordName, setRecordName] = useState('');
    const [recordAmount, setRecordAmount] = useState('');

    
    const handleAddRecord = async () => {
        if (!user) return;
        
        const recordData = {
            user_id: user.id,
            title: recordName,
            amount: recordAmount,
            record_date: new Date().toISOString().slice(0, 10)
        };

        onSave(recordData);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add New Record</h2>
                <input
                    type="text"
                    placeholder="Record Name"
                    value={recordName}
                    onChange={(e) => setRecordName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={recordAmount}
                    onChange={(e) => setRecordAmount(e.target.value)}
                />
                <button type="button" onClick={handleAddRecord}>Post</button>
            </div>
        </div>
    );
}

export default RecordModal;
