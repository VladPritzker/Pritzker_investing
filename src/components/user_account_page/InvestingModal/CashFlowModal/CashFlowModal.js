import React from "react";
import "./CashFlowModal.css"; // Create a CSS file for styling

const CashFlowModal = ({ isOpen, onClose, cashFlows }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Cash Flows</h2>
        <p>{cashFlows}</p>
      </div>
    </div>
  );
};

export default CashFlowModal;
