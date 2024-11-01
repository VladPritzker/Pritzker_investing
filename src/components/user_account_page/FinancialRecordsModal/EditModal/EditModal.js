import React, { useState } from "react";
import "../EditModal/EditModal.css"; // Updated CSS file name

function SpendingRecordsEditModal({ record, onClose }) {
  const [title, setTitle] = useState(record.title || "");
  const [amount, setAmount] = useState(record.amount || "");
  const [recordDate, setRecordDate] = useState(record.record_date || "");

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/financial_records/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          record_id: record.id,
          title,
          amount,
          record_date: recordDate,
        }),
      });

      if (response.ok) {
        console.log("Record updated successfully");
        onClose(); // Close modal after successful update
      } else {
        console.error("Failed to update record");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="spending-records-edit-modal">
      <div className="spending-records-edit-modal-content">
        <span className="spending-records-close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Spending Record</h2>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
          />
        </label>
        <button onClick={handleSave}>Save Changes</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default SpendingRecordsEditModal;
