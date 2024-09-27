import React from "react";
import "../deletConf/deleteConf.css"; // Add styles for the modal

function ConfirmDeleteModal({ onClose, onConfirm, record }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the record "{record.title}"?</p>
        <button style={{ width: "30%" }} onClick={onConfirm}>
          Yes
        </button>
        <button style={{ width: "30%" }} onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
