import React, { useState } from "react";
import "./AddActivityModal.css";

const apiUrl = process.env.REACT_APP_API_URL;

function formatToday() {
  const now = new Date();
  // Format as YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const AddActivityModal = ({ userId, onClose, activityTypes, onAddActivity }) => {
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [activityDate, setActivityDate] = useState(formatToday());

  const handleSave = async () => {
    if (!selectedTypeId || !activityDate) {
      console.error("Missing type or date");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/activities/${userId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_type_id: selectedTypeId,
          date: activityDate,
        }),
      });
      if (response.ok) {
        const newActivity = await response.json();
        onAddActivity(newActivity);
        onClose();
      } else {
        console.error("Failed to create activity");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <div className="add-activity-overlay">
      <div className="add-activity-modal">
        <i className="fas fa-times add-activity-close" onClick={onClose}></i>
        <h3>Add New Activity</h3>

        <div className="add-activity-form-group">
          <label>Activity Type:</label>
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
          >
            <option value="">-- Select Type --</option>
            {activityTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="add-activity-form-group">
          <label>Date:</label>
          <input
            type="date"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
          />
        </div>

        <div className="add-activity-buttons">
          <button onClick={handleSave} className="save-activity-btn">
            Save
          </button>
          <button onClick={onClose} className="cancel-activity-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;
