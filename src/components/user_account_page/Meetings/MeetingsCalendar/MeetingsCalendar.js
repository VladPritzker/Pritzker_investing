import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MeetingsCalendar.css';

const MeetingsCalendar = ({ meetings }) => {
    const [hoveredMeeting, setHoveredMeeting] = useState(null);

    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayMeetings = meetings.filter(
                meeting => new Date(meeting.datetime).toDateString() === date.toDateString()
            );
            return dayMeetings.map(meeting => (
                <div
                    key={meeting.id}
                    className="meeting-dot"
                    onMouseEnter={() => setHoveredMeeting(meeting)}
                    onMouseLeave={() => setHoveredMeeting(null)}
                />
            ));
        }
    };

    return (
        <div className="meetings-calendar-container">
            <Calendar
                tileContent={getTileContent}
            />
            {hoveredMeeting && (
                <div className="meeting-details-popup">
                    <h3>{hoveredMeeting.title}</h3>
                    <p><strong>Date & Time:</strong> {new Date(hoveredMeeting.datetime).toLocaleString()}</p>
                    <p><strong>Done:</strong> {hoveredMeeting.done ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
};

export default MeetingsCalendar;
