import React from "react";
import "./DeleteActivityModal.css";

const DeleteActivityModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-activity-overlay">
      <div className="delete-activity-modal">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this activity?</p>
        <div className="delete-activity-actions">
          <button onClick={onConfirm} className="delete-confirm-btn">
            Delete
          </button>
          <button onClick={onCancel} className="delete-cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteActivityModal;
