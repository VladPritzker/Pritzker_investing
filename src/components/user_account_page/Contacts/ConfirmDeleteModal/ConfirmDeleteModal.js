import React from 'react';
import '../Contacts.module.css';

function ConfirmDeleteModal({ onConfirm, onCancel }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onCancel}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this contact?</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
