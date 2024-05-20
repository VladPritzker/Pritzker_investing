import React from 'react';

function ConfirmDeleteMeetingModal({ onConfirm, onCancel }) {
    return (
        <div className="modal">
            <div className="modal-content" style={{marginTop: '10%'}}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this meeting?</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteMeetingModal;
