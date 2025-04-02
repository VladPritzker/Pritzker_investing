import React from "react";
import "./DayActivitiesModal.css";

const DayActivitiesModal = ({ activities, onClose, getTypeName }) => {
  // Optionally, you can figure out the date if all activities share the same date
  const date = activities.length > 0 ? activities[0].date : null;

  return (
    <div className="day-activities-overlay">
      <div className="day-activities-modal">
        <i
          className="fas fa-times day-activities-close"
          onClick={onClose}
        ></i>
        <h3>Activities for {date || "Selected Date"}</h3>
        {activities.map((act) => (
          <div key={act.id} className="day-activity-entry">
            <p>
              <strong>Type:</strong> {getTypeName(act.activity_type_id)}
            </p>
            <p>
              <strong>Date:</strong> {act.date}
            </p>
            {/* or any other details you might have */}
            <hr />
          </div>
        ))}
        {activities.length === 0 && (
          <p>No activities for this date.</p>
        )}
      </div>
    </div>
  );
};

export default DayActivitiesModal;
