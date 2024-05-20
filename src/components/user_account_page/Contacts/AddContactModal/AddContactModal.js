import React, { useState } from 'react';
import '../Contacts.module.css'; // Use the same styles as ContactsModal

function AddContactModal({ user, onClose, onSave }) {
    const [contactDetails, setContactDetails] = useState({
        name: '',
        phone_number: '',
        note: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactDetails({ ...contactDetails, [name]: value });
    };

    const handleSaveClick = async () => {
        const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/contacts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: contactDetails.name,
                    phone_number: contactDetails.phone_number,
                    note: contactDetails.note,
                    user_id: user.id
                })
            });
            if (response.ok) {
                const newContact = await response.json();
                onSave(newContact); // Pass the new contact to the parent
                onClose();
            } else {
                console.error('Failed to add contact');
            }
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content" style={{marginTop: '10%'}}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add New Contact</h2>
                <input
                    type="text"
                    name="name"
                    value={contactDetails.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                />
                <input
                    type="text"
                    name="phone_number"
                    value={contactDetails.phone_number}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                />
                <input
                    type="text"
                    name="note"
                    value={contactDetails.note}
                    onChange={handleInputChange}
                    placeholder="Note"
                />
                <button onClick={handleSaveClick}>Add</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default AddContactModal;

