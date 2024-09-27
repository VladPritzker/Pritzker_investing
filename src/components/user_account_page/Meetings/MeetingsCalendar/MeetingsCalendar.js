import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MeetingsCalendar.css";
import MeetingDetailsModal from "../MeetingDetailsModal/MeetingDetailsModal";

const MeetingsCalendar = ({ meetings }) => {
  const [hoveredMeeting, setHoveredMeeting] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [calendarSize, setCalendarSize] = useState({
    width: "100%",
    height: "100%",
  });

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const dayMeetings = meetings.filter(
        (meeting) =>
          new Date(meeting.datetime).toDateString() === date.toDateString(),
      );
      return dayMeetings.map((meeting) => (
        <div
          key={meeting.id}
          className="meeting-dot"
          onClick={() => setSelectedMeeting(meeting)}
        />
      ));
    }
  };

  return (
    <div className="meetings-calendar-container">
      <Calendar
        tileContent={getTileContent}
        style={{ width: calendarSize.width, height: calendarSize.height }}
      />
      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
};

export default MeetingsCalendar;
