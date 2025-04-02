import React, { useState } from "react";
import "./AddActivityTypeModal.css";

const apiUrl = process.env.REACT_APP_API_URL;

const AddActivityTypeModal = ({ userId, activityTypes, setActivityTypes, onClose }) => {
  const [newTypeName, setNewTypeName] = useState("");

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
      const res = await fetch(`${apiUrl}/activity-types/${userId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTypeName })
      });
      if (res.ok) {
        const created = await res.json();
        setActivityTypes((prev) => [...prev, created]);
        setNewTypeName("");
      } else {
        console.error("Failed to create activity type");
      }
    } catch (err) {
      console.error("Error creating activity type:", err);
    }
  };

  const handleDeleteType = async (typeId) => {
    try {
      const res = await fetch(`${apiUrl}/activity-types/${userId}/${typeId}/`, {
        method: "DELETE"
      });
      if (res.ok) {
        setActivityTypes((prev) => prev.filter((t) => t.id !== typeId));
      } else {
        console.error("Failed to delete activity type");
      }
    } catch (err) {
      console.error("Error deleting type:", err);
    }
  };

  return (
    <div className="add-activity-overlay">
      <div className="add-activity-modal">
        <i className="fas fa-times add-activity-close" onClick={onClose}></i>
        <h3>Manage Activity Types</h3>

        <div className="add-activity-form-group">
          <label>New Type Name:</label>
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          />
        </div>

        <div className="add-activity-buttons">
          <button onClick={handleAddType} className="save-activity-btn">
            Add
          </button>
          <button onClick={onClose} className="cancel-activity-btn">
            Close
          </button>
        </div>

        <hr />

        <h4>Existing Types:</h4>
        <div className="existing-types-list">
          {activityTypes.map((t) => (
            <div key={t.id} className="type-item">
              <span className="type-name">{t.name}</span>
              <button
                onClick={() => handleDeleteType(t.id)}
                className="type-delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddActivityTypeModal;
