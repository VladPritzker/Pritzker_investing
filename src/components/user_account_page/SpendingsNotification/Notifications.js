import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Notifications.css"; // You'll create this CSS file for styling

const apiUrl = process.env.REACT_APP_API_URL;

const Notifications = ({ userId, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(`${apiUrl}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
      // After fetching, mark them as read
      const notificationIds = response.data.map((n) => n.id);
      if (notificationIds.length > 0) {
        await markNotificationsAsRead(notificationIds);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationsAsRead = async (notificationIds) => {
    try {
      const token = sessionStorage.getItem("authToken");
      await axios.post(
        `${apiUrl}/notifications/mark_as_read/`,
        {
          notification_ids: notificationIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="notifications-modal-overlay">
      <div className="notifications-modal" ref={modalRef}>
        <div className="notifications-modal-header">
          <h3>Notifications</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="notifications-content">
          {isLoading ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <p>{notification.message}</p>
                  <small>
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
