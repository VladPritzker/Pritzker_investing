// ConfirmDeleteModal.js
import React from 'react';
import '../ConfirmDelete/confirmDelete.css';

function ConfirmDeleteModal({ onClose, onConfirm }) {
    return (
        <div className="modal" style={{marginTop: '10%'}}>
            <div className="modal-content">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this record?</p>
                <div className="modal-actions">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
