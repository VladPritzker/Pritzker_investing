import React from "react";
import "../TimeManagementModal.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="delete-confirmation-modal">
        <h2>Are you sure you want to delete this entry?</h2>
        <div className="delete-modal-actions">
          <button onClick={onConfirm} className="delete-confirm-button">
            Yes
          </button>
          <button onClick={onCancel} className="delete-cancel-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
