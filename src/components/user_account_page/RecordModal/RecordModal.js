import React, { useState, useEffect } from "react";
import "../RecordModal/RecordModal.css";
const apiUrl = process.env.REACT_APP_API_URL;

function RecordModal({ user, onClose }) {
  const [recordName, setRecordName] = useState("");
  const [recordAmount, setRecordAmount] = useState("");

  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)",
    );
    return cookieValue ? cookieValue.pop() : "";
  }

  const handleSaveRecord = async () => {
    if (!user) return;
    if (
      recordName.trim() === "" ||
      isNaN(recordAmount) ||
      recordAmount.trim() === ""
    ) {
      alert("Please enter a valid record name and amount.");
      return;
    }

    const recordData = {
      user_id: user.id,
      title: recordName,
      amount: recordAmount,
      record_date: new Date().toISOString().slice(0, 10), // Ensure date is correctly formatted
    };

    try {
      const csrftoken = getCookie("csrftoken");
      const response = await fetch(`${apiUrl}/financial_records/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(recordData),
      });

      if (response.ok) {
        alert("Record added successfully!");
        onClose(); // Optionally close the modal on success
      } else {
        const errorData = await response.json();
        alert(`Failed to add record: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal-content" style={{ marginTop: "10%" }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add New Record</h2>
        <input
          type="text"
          placeholder="Record Name"
          value={recordName}
          onChange={(e) => setRecordName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={recordAmount}
          onChange={(e) => setRecordAmount(e.target.value)}
        />
        <button type="button" onClick={handleSaveRecord}>
          Post
        </button>
      </div>
    </div>
  );
}
export default RecordModal;
