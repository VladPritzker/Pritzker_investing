import React, { useState, useEffect } from "react";
import "./ActivitiesModal.css";
import AddActivityTypeModal from "./AddActivityTypeModal/AddActivityTypeModal";
import AddActivityModal from "./AddActivityModal/AddActivityModal";
import DeleteActivityModal from "./DeleteActivityModal/DeleteActivityModal";
import DayActivitiesModal from "./DayActivitiesModal/DayActivitiesModal"; // NEW modal
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ActivitiesChartModal from "./ActivitiesChartModal/ActivitiesChartModal"; // <-- import your new chart modal

const apiUrl = process.env.REACT_APP_API_URL;

const ActivitiesModal = ({ userId, onClose }) => {
  const [activityTypes, setActivityTypes] = useState([]);
  const [activities, setActivities] = useState([]);

  // Modals
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // New: For the day-details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDateActivities, setSelectedDateActivities] = useState([]);

  const [deleteActivityId, setDeleteActivityId] = useState(null);

  // Filters
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Calendar month/year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Editing
  const [editActivityId, setEditActivityId] = useState(null);
  const [editData, setEditData] = useState({ activity_type_id: "", date: "" });

  // Chart modal 
  const [showChartModal, setShowChartModal] = useState(false);


  /** -------------- Fetch Data -------------- **/
  const fetchActivityTypes = async () => {
    try {
      const res = await fetch(`${apiUrl}/activity-types/${userId}/`);
      if (res.ok) {
        const data = await res.json();
        setActivityTypes(data);
      } else {
        console.error("Failed to fetch activity types");
      }
    } catch (err) {
      console.error("Error fetching activity types:", err);
    }
  };

  const fetchActivities = async (typeId = "all", dateFilter = "") => {
    try {
      let url = `${apiUrl}/activities/${userId}/?`;
      if (typeId !== "all") url += `type_id=${typeId}&`;
      if (dateFilter) url += `filter_date=${dateFilter}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      } else {
        console.error("Failed to fetch activities");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActivityTypes();
      fetchActivities("all", "");
    }
  }, [userId]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  /* Whenever filter changes, fetch automatically */
  useEffect(() => {
    fetchActivities(selectedTypeFilter, filterDate);
    // eslint-disable-next-line
  }, [selectedTypeFilter, filterDate]);

  /** -------------- Filters -------------- **/
  const handleFilterTypeChange = (e) => {
    setSelectedTypeFilter(e.target.value);
  };
  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };
  const handleResetFilter = () => {
    setSelectedTypeFilter("all");
    setFilterDate("");
  };

  /** -------------- Add / Delete / Edit -------------- **/
  const handleAddActivity = (newAct) => {
    setActivities((prev) => [...prev, newAct]);
  };

  const openDeleteModal = (id) => {
    setDeleteActivityId(id);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteActivityId(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/activities/${userId}/${deleteActivityId}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActivities((prev) => prev.filter((a) => a.id !== deleteActivityId));
      } else {
        console.error("Failed to delete activity");
      }
    } catch (err) {
      console.error("Error deleting activity:", err);
    } finally {
      closeDeleteModal();
    }
  };

  // Edit
  const handleEditClick = (act) => {
    setEditActivityId(act.id);
    setEditData({
      activity_type_id: act.activity_type_id,
      date: act.date,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveEdit = async () => {
    if (!editActivityId) return;
    try {
      const res = await fetch(`${apiUrl}/activities/${userId}/${editActivityId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_type_id: editData.activity_type_id,
          date: editData.date,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActivities((prev) =>
          prev.map((a) => (a.id === editActivityId ? updated : a))
        );
        setEditActivityId(null);
        setEditData({ activity_type_id: "", date: "" });
      } else {
        console.error("Failed to update activity");
      }
    } catch (err) {
      console.error("Error updating activity:", err);
    }
  };
  const handleCancelEdit = () => {
    setEditActivityId(null);
    setEditData({ activity_type_id: "", date: "" });
  };

  /** --------------  Click on Calendar Day => Show details -------------- **/
  const handleClickDay = (value, event) => {
    const clickedDateStr = value.toISOString().split("T")[0];
    // Filter out the activities for that day
    const dayActivities = activities.filter((a) => a.date === clickedDateStr);

    if (dayActivities.length > 0) {
      setSelectedDateActivities(dayActivities);
      setShowDetailsModal(true);
    } else {
      // Optional: Show an alert or do nothing if there's no activity
      console.log("No activities for this date.");
    }
  };

  /** --------------  Calendar Tile Content  -------------- **/
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const dayStr = date.toISOString().split("T")[0];
      const dayActivities = activities.filter((a) => a.date === dayStr);
      if (dayActivities.length > 0) {
        return (
          <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(dayActivities.length)].map((_, i) => (
              <i key={i} className="fas fa-check-circle calendar-activity-icon"></i>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const getTypeName = (typeId) => {
    const found = activityTypes.find((t) => t.id === typeId);
    return found ? found.name : "Unknown";
  };

  return (
    <div className="activities-modal-overlay">
      <div className="activities-modal">
        <i className="fas fa-times activities-modal-close" onClick={onClose}></i>
        <h2>Activities</h2>

        <div className="activities-button-container">
          <button
            onClick={() => setShowTypeModal(true)}
            className="add-activity-button"
          >
            Manage Activity Types
          </button>

          <button
            onClick={() => setShowAddActivityModal(true)}
            className="add-activity-button"
          >
            Add Activity
          </button>

          <button onClick={() => setShowChartModal(true)} className="add-activity-button">
            View Chart
          </button>
        </div>

        {/* Filters */}
        <div className="filter-container">
          <label>Type:</label>
          <select value={selectedTypeFilter} onChange={handleFilterTypeChange}>
            <option value="all">All</option>
            {activityTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label>Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilterChange}
          />

          <button onClick={handleResetFilter}>Reset</button>
        </div>

        {/* Calendar with onClickDay */}
        <Calendar
          value={new Date(currentYear, currentMonth)}
          tileContent={renderTileContent}
          onActiveStartDateChange={({ activeStartDate }) => {
            setCurrentMonth(activeStartDate.getMonth());
            setCurrentYear(activeStartDate.getFullYear());
          }}
          onClickDay={handleClickDay} // <--- Click date => open details
        />

        <div className="activities-container">
          {activities.map((act) => (
            <div key={act.id} className="activity-entry">
              {editActivityId === act.id ? (
                <div className="edit-activity-form">
                  <label>Activity Type:</label>
                  <select
                    name="activity_type_id"
                    value={editData.activity_type_id}
                    onChange={handleEditChange}
                  >
                    <option value="">-- Select Type --</option>
                    {activityTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                  />
                  <div className="activities-button-container">
                    <button
                      onClick={handleSaveEdit}
                      className="save-activity-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-activity-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>
                    <strong>Type:</strong> {getTypeName(act.activity_type_id)}
                  </p>
                  <p>
                    <strong>Date:</strong> {act.date}
                  </p>
                  <div className="activities-button-container">
                    <button
                      onClick={() => handleEditClick(act)}
                      className="edit-activity-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteActivityId(act.id);
                        setShowDeleteModal(true);
                      }}
                      className="delete-activity-button"
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

      {/* Manage Types Modal */}
      {showTypeModal && (
        <AddActivityTypeModal
          userId={userId}
          activityTypes={activityTypes}
          setActivityTypes={setActivityTypes}
          onClose={() => setShowTypeModal(false)}
        />
      )}

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <AddActivityModal
          userId={userId}
          onClose={() => setShowAddActivityModal(false)}
          activityTypes={activityTypes}
          onAddActivity={handleAddActivity}
        />
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <DeleteActivityModal
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}

      {/* NEW: Day Activities Modal */}
      {showDetailsModal && (
        <DayActivitiesModal
          activities={selectedDateActivities} // pass the array of day activities
          onClose={() => setShowDetailsModal(false)}
          getTypeName={getTypeName} // to resolve type name
        />
      )}

       {/* NEW: ActivitiesChartModal */}
       {showChartModal && (
        <ActivitiesChartModal
          onClose={() => setShowChartModal(false)}
          allActivities={activities}    // pass all activity data
          activityTypes={activityTypes} // pass type list for filtering
        />
      )}
    </div>
  );
};

export default ActivitiesModal;
