import React, { useState } from 'react';
import '../RecordModal/RecordModal.css';

function RecordModal({ user, onClose, onSave }) {
    const [recordName, setRecordName] = useState('');
    const [recordAmount, setRecordAmount] = useState('');
    

    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }


    const handleSaveRecord = async (recordData) => {
        try {
            const csrftoken = getCookie('csrftoken'); // Obtain CSRF token from cookies
            const response = await fetch('http://127.0.0.1:8000/financial_records/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken 
                },
                body: JSON.stringify(recordData)
            });

            if (response.ok) {
                alert('Record added successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to add record: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            alert(`Network error: ${error.message}`);
            console.log(recordData)
        }
    };

    
    const handleAddRecord = async () => {
        if (!user) return;
        if (recordName.trim() === '') {
            alert('Please enter a record name.');
            return;
        }
        if (isNaN(recordAmount) || recordAmount.trim() === '') {
            alert('Please enter a valid amount.');
            return;
        }
        
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
                <button type="button" onClick={handleAddRecord} onSave={handleSaveRecord}>Post</button>
            </div>
        </div>
    );
}

export default RecordModal;
