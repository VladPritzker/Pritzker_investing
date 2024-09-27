import React from "react";
import "../MeetingDetailsModal/MeetingDetailsModal.css";

const MeetingDetailsModal = ({ meeting, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3>{meeting.title}</h3>
        <p>
          <strong>Date & Time:</strong>{" "}
          {new Date(meeting.datetime).toLocaleString()}
        </p>
        <p>
          <strong>Done:</strong> {meeting.done ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;
