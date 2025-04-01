import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// If you want styles like the Sleep logs modal, reuse CSS or replicate as needed
import "./ActivitiesModal.css"; 
import AddActivityModal from "./AddActivityModal";  // We'll define this sub-modal below
import DeleteConfirmationModal from "../TimeManagementModal/DeleteModalSleepLogs/DeleteModal";

const apiUrl = process.env.REACT_APP_API_URL;

const ActivitiesModal = ({ userId, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteActivityId, setDeleteActivityId] = useState(null);

  // For editing an activity
  const [editActivityId, setEditActivityId] = useState(null);
  const [editActivityData, setEditActivityData] = useState({
    name: "",
    date: "",
  });

  // For adding a new activity
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // For Calendar
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Fetch activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${apiUrl}/activities/${userId}/`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          console.error("Failed to fetch activities");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Helper: Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Open delete confirmation
  const handleDelete = (activityId) => {
    setDeleteActivityId(activityId);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/activities/${userId}/${deleteActivityId}/`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setActivities((prev) =>
          prev.filter((activity) => activity.id !== deleteActivityId)
        );
        setIsDeleteModalOpen(false);
        setDeleteActivityId(null);
      } else {
        console.error("Failed to delete activity");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteActivityId(null);
  };

  // Edit an activity
  const handleEdit = (activity) => {
    setEditActivityId(activity.id);
    setEditActivityData({
      name: activity.name,
      date: formatDate(activity.date),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditActivityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/activities/${userId}/${editActivityId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editActivityData.name,
            date: editActivityData.date,
          }),
        }
      );
      if (response.ok) {
        const updated = await response.json();
        setActivities((prev) =>
          prev.map((act) => (act.id === editActivityId ? updated : act))
        );
        setEditActivityId(null);
        setEditActivityData({ name: "", date: "" });
      } else {
        console.error("Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditActivityId(null);
    setEditActivityData({ name: "", date: "" });
  };

  // Add new activity
  const handleAddActivity = (newActivity) => {
    // Insert into the local state
    setActivities((prev) => [...prev, newActivity]);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Calendar tile content or styling (optional)
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      // Check if there's an activity for this day
      const dayStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const hasActivity = activities.some(
        (act) => formatDate(act.date) === dayStr
      );
      if (hasActivity) {
        // Return an icon or highlight
        return <i className="fas fa-check-circle calendar-activity-icon" />;
      }
    }
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="activities-modal">
        <i className="fas fa-times modal-close" onClick={onClose}></i>
        <h2>Activities</h2>

        <div className="button-container">
          <button onClick={handleOpenAddModal} className="add-button">
            Add Activity
          </button>
        </div>

        {/* Calendar to visually show which days have activities */}
        <Calendar
          value={new Date(currentYear, currentMonth)}
          tileContent={renderTileContent}
          onActiveStartDateChange={({ activeStartDate }) => {
            setCurrentMonth(activeStartDate.getMonth());
            setCurrentYear(activeStartDate.getFullYear());
          }}
        />

        {/* List of Activities */}
        <div className="activities-list">
          {activities.map((act) => (
            <div key={act.id} className="activity-entry">
              {editActivityId === act.id ? (
                <div className="edit-activity-form">
                  <label>Activity Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editActivityData.name}
                    onChange={handleEditChange}
                  />
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={editActivityData.date}
                    onChange={handleEditChange}
                  />
                  <div className="buttons-row">
                    <button onClick={handleSaveEdit} className="save-button">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>
                    <strong>Activity:</strong> {act.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(act.date).toLocaleDateString()}
                  </p>
                  <div className="buttons-row">
                    <button onClick={() => handleEdit(act)} className="edit-button">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(act.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <AddActivityModal
          userId={userId}
          onClose={handleCloseAddModal}
          onAddActivity={handleAddActivity}
        />
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ActivitiesModal;
