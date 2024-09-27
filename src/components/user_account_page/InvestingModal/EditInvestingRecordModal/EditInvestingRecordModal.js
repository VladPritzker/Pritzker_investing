import React, { useState } from "react";
import "./EditInvestingRecordModal.css";
import investmentTypes from "../AddInvestingRecord/investmentTypes.json"; // Adjust the path as necessary

const apiUrl = process.env.REACT_APP_API_URL;

function EditInvestingRecordModal({
  record,
  onClose,
  onSave,
  fetchInvestingRecords,
}) {
  const [editingRecord, setEditingRecord] = useState({ ...record });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRecord({ ...editingRecord, [name]: value });
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/investing_records/${record.user_id}/${record.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingRecord),
        },
      );

      if (response.ok) {
        onSave();
        fetchInvestingRecords();
      } else {
        console.error("Failed to update investing record.");
      }
    } catch (error) {
      console.error("Error updating investing record:", error);
    }
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <span className="edit-modal-close" onClick={onClose}>
          &times;
        </span>
        <h2 className="edit-modal-header">Edit Investing Record</h2>
        <input
          type="text"
          name="title"
          value={editingRecord.title}
          onChange={handleInputChange}
          className="edit-modal-input"
          placeholder="Record name"
        />
        <input
          type="number"
          name="amount"
          value={editingRecord.amount}
          onChange={handleInputChange}
          className="edit-modal-input"
          placeholder="Amount"
        />
        <input
          type="number"
          name="tenor"
          value={editingRecord.tenor}
          onChange={handleInputChange}
          className="edit-modal-input"
          placeholder="Tenor (years)"
        />
        <select
          name="type_invest"
          value={editingRecord.type_invest}
          onChange={handleInputChange}
          className="edit-modal-select"
          placeholder="Type of investment"
        >
          {Object.entries(investmentTypes).map(([type, details]) => (
            <option key={type} value={type}>
              {type} (Rate: {details.rate})
            </option>
          ))}
        </select>

        <input
          type="number"
          name="discount_rate"
          value={editingRecord.discount_rate}
          onChange={handleInputChange}
          className="edit-modal-input"
          placeholder="Discount rate"
        />
        <button onClick={saveChanges} className="edit-modal-button">
          Save
        </button>
        <button onClick={onClose} className="edit-modal-button-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditInvestingRecordModal;
