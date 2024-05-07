import React, { useState, useEffect } from 'react';
import '../RecordModal/RecordModal.css';
import investmentTypes from './investmentTypes.json'; // Adjust the path as necessary


function AddInvestingRecord({ user, onClose,  token }) {
    const [recordName, setRecordName] = useState('');
    const [recordAmount, setRecordAmount] = useState('');
    const [recordTenor, setRecordTenor] = useState('');
    const [recordTypeInvest, setRecordTypeInvest] = useState('');
    
    
    
    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }
    const handleSaveInvestRecord = async (recordData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/investing_records/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,  // Assuming token authentication
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(recordData)
            });

            if (response.ok) {
                alert('Record added successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to add record: ${errorData.error || "Unknown error"}`);
                console.log(recordData)
            }
        } catch (error) {
            alert(`Network error: ${error.message}`);
            console.log(recordData)
        }
    };
    const handleAddRecord = async () => {
        if (!user) return;
        if (recordName.trim() === '' || isNaN(recordAmount) || recordAmount.trim() === '') {
            alert('Please ensure all fields are filled out correctly.');
            return;
        }
        if(recordTypeInvest.trim() === ''){
            alert('Please select a valid investment type');
            return;
        }
    
        const recordData = {
            user_id: user.id,
            title: recordName,
            amount: recordAmount,
            record_date: new Date().toISOString().slice(0, 10),  // Ensure correct formatting
            tenor: recordTenor,  // Ensure this is a number if required by backend
            type_invest: recordTypeInvest  // Ensure this matches one of the expected types
        };
    
        console.log("Sending data to server:", recordData);
        handleSaveInvestRecord(recordData);
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
                <input
                    type="number"
                    placeholder="Tenor (years)"
                    value={recordTenor}
                    onChange={(e) => setRecordTenor(e.target.value)}
                />


                <div className="select-container">
                        <select  onChange={(e) => setRecordTypeInvest(e.target.value)}>
                            <option value={recordTypeInvest}>All Types</option>
                            {Object.entries(investmentTypes).map(([type, id]) => (
                                <option key={id} value={type}>{type}</option>
                            ))}
                        </select>
                </div>
                
                <button type="button" onClick={handleAddRecord}>Post</button>

            </div>
        </div>
    );
}
export default AddInvestingRecord;
