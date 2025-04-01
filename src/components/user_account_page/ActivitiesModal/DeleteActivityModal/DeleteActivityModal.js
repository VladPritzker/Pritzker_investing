// DeleteConfirmationModal.js
import React from "react";
import "./DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <h3>Are you sure you want to delete this item?</h3>
        <div className="buttons">
          <button onClick={onConfirm} className="confirm-button">Delete</button>
          <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
