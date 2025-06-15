import React, { useState } from "react";
import "./AddActivityModal.css";

const apiUrl = process.env.REACT_APP_API_URL;

function formatNowForInput() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const local = new Date(now.getTime() - offsetMs);
  return local.toISOString().slice(0, 16);
}

const AddActivityModal = ({ userId, onClose, activityTypes, onAddActivity }) => {
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [activityDatetime, setActivityDatetime] = useState(formatNowForInput());

  const handleSave = async () => {
    if (!selectedTypeId || !activityDatetime) {
      console.error("Missing type or datetime");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/activities/${userId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_type_id: selectedTypeId,
          datetime: activityDatetime,
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
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            value={activityDatetime}
            onChange={(e) => setActivityDatetime(e.target.value)}
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