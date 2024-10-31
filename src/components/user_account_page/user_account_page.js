import axios from 'axios';
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FinancialRecordsModal from "../user_account_page/FinancialRecordsModal/FinancialRecordsModal";
import InvestingRecordsModal from "../user_account_page/InvestingModal/InvestingModal";
import NotesModal from "../user_account_page/Notes/notes";
import PhotoUploadModal from "../user_account_page/uploadPhoto/uploadphoto";
import IncomeRecordsModal from "./IncomeModal/IncomeRecordsModal";
import ContactsModal from "../user_account_page/Contacts/contacts";
import MeetingsModal from "./Meetings/MeetingsModal";
import "../user_account_page/user_account_page.css";
import SleepLogsModal from "../user_account_page/TimeManagementModal/TimeManagementModal";
import InvestingComparison from "./StockData/StockData";
import VirtualAssistant from "./VirtualAssistant/VirtualAssistant";
import EnvelopeModal from './Docusign/docusign_modal';



const apiUrl = process.env.REACT_APP_API_URL;

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function UserAccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
  const [showRecordList, setShowRecordList] = useState(false);
  const [showInvestList, setShowInvestList] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState(false);
  const [hasTodayMeetings, setHasTodayMeetings] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [showMonthlySpending, setShowMonthlySpending] = useState(false);
  const [showYearlySpending, setShowYearlySpending] = useState(false);
  const [showMonthlyIncome, setShowMonthlyIncome] = useState(false);
  const [showYearlyIncome, setShowYearlyIncome] = useState(false);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [showSleepLogsModal, setShowSleepLogsModal] = useState(false);
  // const [showInvestingComparison, setShowInvestingComparison] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false); // Default to false
  const [isBalanceGoalVisible, setIsBalanceGoalVisible] = useState(false); // Default to false
  const [showModal, setShowModal] = useState(false);



  

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleSendEnvelope = async (email, name) => {
        try {
            const response = await axios.post(`${apiUrl}/send-envelope/`, {
                email,
                name
            });
            alert('Envelope sent successfully!');
            handleCloseModal();
        } catch (error) {
            console.error('Error sending envelope:', error);
            alert('Failed to send envelope. Please try again.');
        }
    };

    const handleDownloadEnvelopes = async () => {
        try {
            const response = await axios.post(`${apiUrl}/download-new-envelopes/`);
            alert('Envelopes downloaded successfully!');
            handleCloseModal();
        } catch (error) {
            console.error('Error downloading envelopes:', error);
            alert('Failed to download envelopes. Please try again.');
        }
    };


  const numberFormat = (number) =>
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(number || 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchMeetings = useCallback(async () => {
    if (user && user.id) {
      try {
        const response = await fetch(`${apiUrl}/meetings/${user.id}/`);
        if (response.ok) {
          const data = await response.json();
          setMeetings(data);
          checkForTodayMeetings(data); // Check for today's meetings after fetching
        } else {
          console.error("Failed to fetch meetings");
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = location.state?.user;
      if (storedUser?.id) {
        try {
          const response = await fetch(`${apiUrl}/users/${storedUser.id}/`);
          if (response.ok) {
            const updatedUser = await response.json();
            console.log("Fetched user data:", updatedUser); // Log the entire user data
            setUser(updatedUser);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [location.state?.user]);

  const handleSaveSleepLog = (wakeUpTime, sleepTime) => {
    const newLog = {
      id: sleepLogs.length + 1,
      date: new Date().toLocaleDateString(),
      sleep_time: new Date().setHours(
        sleepTime.split(":")[0],
        sleepTime.split(":")[1],
      ),
      wake_time: new Date().setHours(
        wakeUpTime.split(":")[0],
        wakeUpTime.split(":")[1],
      ),
    };
    setSleepLogs([...sleepLogs, newLog]);
  };

  const handleDeleteSleepLog = (id) => {
    setSleepLogs(sleepLogs.filter((log) => log.id !== id));
  };

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const checkForTodayMeetings = (meetings) => {
    if (!meetings) {
      console.error("Meetings data is not available.");
      return;
    }

    // console.log("Checking for today's meetings:", new Date().toDateString());
    // console.log("Meetings:", meetings); // Log meetings data
    const today = new Date().toDateString();
    const todayMeetings = meetings.filter(
      (meeting) => new Date(meeting.datetime).toDateString() === today,
    );
    // console.log("Today's meetings:", todayMeetings); // Log today's meetings
    setHasTodayMeetings(todayMeetings.length > 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const handleFinancialRecordsListClick = () => {
    setShowRecordList(true);
  };

  const showMonthlyYearlySpending = () => {
    setShowMonthlySpending((prevState) => !prevState);
    setShowYearlySpending((prevState) => !prevState);
  };

  const showMonthlyYearlyIncome = () => {
    setShowMonthlyIncome((prevState) => !prevState);
    setShowYearlyIncome((prevState) => !prevState);
  };

  const handleInvestRecordsListClick = () => {
    setShowInvestList(true);
  };

  const handleIncomeRecordsListClick = () => {
    setShowIncomeModal(true);
  };

  const handleContactsListClick = () => {
    setShowContactsModal(true);
  };

  const handleMeetingsListClick = () => {
    setShowMeetingsModal(true);
  };

  const handleRefreshDataClick = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${user.id}/`);
      if (response.ok) {
        const updatedUser = await response.json();
        console.log("Data refreshed successfully:", updatedUser);
        setUser(updatedUser);
        fetchMeetings(); // Fetch meetings separately
      } else {
        const errorData = await response.json();
        console.error("Failed to refresh data:", errorData);
        alert("Failed to refresh data.");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);

      alert("Failed to refresh data. Please try again later.");
    }
  };

  const handleUpdateClick = async (field) => {
    const newValue = prompt(`Enter new value for ${field}:`, user[field]);
    if (newValue !== null && newValue !== user[field]) {
      try {
        const csrfToken = getCookie("csrftoken");
        const response = await fetch(`${apiUrl}/users/${user.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include CSRF token in headers
          },
          credentials: "include", // Include credentials to ensure cookies are sent
          body: JSON.stringify({ [field]: newValue }),
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (!response.ok) {
          console.error("Failed to update data:", responseData);
          alert("Failed to update data.");
          return;
        }

        console.log("Data updated successfully:", responseData);
        setUser((prevUser) => ({ ...prevUser, [field]: newValue }));

        // Ensure meetings data is updated before checking today's meetings
        if (responseData.meetings && Array.isArray(responseData.meetings)) {
          setMeetings(responseData.meetings);
          checkForTodayMeetings(responseData.meetings); // Check for today's meetings
        } else {
          setMeetings([]);
          console.warn("No meetings data found in response.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        alert("Failed to update data. Please try again later.");
      }
    }
  };

  const handlePhotoUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
        console.error("No files selected");
        return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
        const response = await fetch(`${apiUrl}/users/${user.id}/upload_photo/`, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Photo uploaded successfully:", data.file_url);
          // Set the user's photo to the full image URL
          setUser((prevUser) => ({ ...prevUser, photo: data.file_url }));
          setShowPhotoInput(false);
          handleRefreshDataClick();
        } else {
            const errorData = await response.json();
            console.error("Failed to upload photo:", errorData);
        }
    } catch (error) {
        console.error("Error uploading photo:", error);
    }
};

  

  const handlePhotoUploadClick = () => {
    setShowPhotoInput(true);
  };

  const goalDifference = user?.balance_goal
    ? (user.balance_goal - user.balance).toFixed(2)
    : null;

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const toggleBalanceGoalVisibility = () => {
    setIsBalanceGoalVisible(!isBalanceGoalVisible);
  };

  const styles = {
    updateButton: {
      width: "60px",
      padding: "5px 5px 5px 5px",
      fontSize: "12px",
      marginRight: "10px",
      backgroundColor: "#0056b3",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    updateButtonHover: {
      backgroundColor: "#004494",
    },
    textStyle: {
      fontSize: "1.8em",
      marginLeft: "10px",
      cursor: "pointer", // Change the cursor to indicate clickable
    },
    timeStyle: {
      fontSize: "1.5em",
      marginLeft: "0",
      borderBottom: "none",
    },
    notificationIcon: {
      position: "absolute",
      top: "0",
      right: "0",
      backgroundColor: "#007aff", // Bright Blue
      borderRadius: "50%",
      width: "12px",
      height: "12px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "10px",
      fontWeight: "bold",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
      border: "2px solid #f0f0f0", // Slightly Off-White
    },
  };

  const stylesUp = {
    updateButton: {
      width: "60px",
      padding: "5px 5px 5px 5px",
      fontSize: "12px",
      marginRight: "10px",
      backgroundColor: "#0056b3",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "-20%",
    },
    updateButtonHover: {
      backgroundColor: "#004494",
    },
  };

  function getImageUrl(photoPath) {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    return `${apiUrl}${photoPath}`;
  }
  

  return (
    <div className="login-container">
      <form className="login-form">
        <VirtualAssistant userId={user?.id} />
        <div className="content-container">
          <div className="buttons" style={{ marginTop: "5%" }}>
            <button
              className="logout"
              style={{ marginBottom: "20%" }}
              onClick={handleLogout}
            >
              Logout
            </button>
            {user ? (
  <>
    <h1>{user.username}'s Profile</h1>
    {user && user.photo ? (
  <img 
    src={user.photo} 
    alt="User profile" 
    style={{
      width: "150px", 
      height: "150px", 
      borderRadius: "50%", 
      objectFit: "cover", 
      border: "2px solid #ccc",
      marginLeft: "25px",
      marginBottom: "30px"

    }} 
  />
) : (
  <p>No profile photo available</p>
)}
  </>
) : (
  <p>Loading user data...</p>
)}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                marginLeft: "30%",
              }}
            >
              <button
                type="button"
                className="upload-button"
                style={stylesUp.updateButton}
                onClick={handlePhotoUploadClick}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={handleRefreshDataClick}
                style={styles.updateButton}
              >
                Refresh
              </button>
            </div>

            <button type="button" onClick={() => setShowNotesModal(true)}>
              Tasks
            </button>
            <button type="button" onClick={handleFinancialRecordsListClick}>
              Spendings
            </button>
            <button
              id="income"
              type="button"
              onClick={handleIncomeRecordsListClick}
            >
              Income
            </button>
            <button
              id="contacts"
              type="button"
              onClick={handleContactsListClick}
            >
              Contacts
            </button>
            <button
              id="refresh"
              type="button"
              onClick={handleInvestRecordsListClick}
            >
              Investings
            </button>
            <button
              id="meetings"
              type="button"
              onClick={handleMeetingsListClick}
              style={{ position: "relative" }}
            >
              Meetings
              {hasTodayMeetings && (
                <span style={styles.notificationIcon}></span>
              )}
            </button>

            {/* <button
              id="InvestingComparison"
              type="button"
              onClick={() => setShowInvestingComparison(true)}
            >
              Stocks Data
            </button> */}
            <button
              id="SleepLogs"
              type="button"
              onClick={() => setShowSleepLogsModal(true)}
            >
              Sleep Logs
            </button>

            {/* <button variant="primary" type="button" onClick={handleShowModal}>
                Manage Envelopes
            </button> */}
          </div>
          <div className="data-rows">
            <h1 style={{ marginLeft: "-40%" }}>User Data</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("username")}
              >
                Update
              </button>
              <p style={styles.textStyle}>
                <strong>Username:</strong> {user?.username}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("email")}
              >
                Update
              </button>
              <p style={styles.textStyle}>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("balance")}
              >
                Update
              </button>
              <p style={styles.textStyle} onClick={toggleBalanceVisibility}>
                <strong>Balance:</strong> $
                {isBalanceVisible ? numberFormat(user?.balance) : "****"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("balance_goal")}
              >
                Update
              </button>
              <p style={styles.textStyle} onClick={toggleBalanceGoalVisibility}>
                <strong>Balance Goal:</strong> $
                {isBalanceGoalVisible
                  ? numberFormat(user?.balance_goal)
                  : "****"}
                <span style={{ color: "red", marginLeft: "20px" }}>
                  {goalDifference !== null &&
                    `(${goalDifference > 0 ? "-" : "+"}$${numberFormat(Math.abs(goalDifference))})`}
                </span>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("money_invested")}
              >
                Update
              </button>
              <p style={styles.textStyle}>
                <strong>Money Invested:</strong> $
                {numberFormat(user?.money_invested)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("income_by_week")}
              >
                Update
              </button>
              <p style={styles.textStyle} onClick={showMonthlyYearlyIncome}>
                <strong>Income this week</strong>
                <span style={{ color: "green", marginLeft: "10px" }}>
                  ${numberFormat(user?.income_by_week)}
                </span>
              </p>
            </div>
            {showMonthlyIncome && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <button
                  type="button"
                  className="update-button"
                  style={styles.updateButton}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButtonHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButton.backgroundColor)
                  }
                  onClick={() => handleUpdateClick("income_by_month")}
                >
                  Update
                </button>
                <p style={styles.textStyle}>
                  <strong>Income this Month:</strong>
                  <span style={{ color: "green", marginLeft: "10px" }}>
                    ${numberFormat(user?.income_by_month)}
                  </span>
                </p>
              </div>
            )}
            {showYearlyIncome && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <button
                  type="button"
                  className="update-button"
                  style={styles.updateButton}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButtonHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButton.backgroundColor)
                  }
                  onClick={() => handleUpdateClick("income_by_year")}
                >
                  Update
                </button>
                <p style={styles.textStyle}>
                  <strong>Income this Year:</strong>
                  <span style={{ color: "green", marginLeft: "10px" }}>
                    ${numberFormat(user?.income_by_year)}
                  </span>
                </p>
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                className="update-button"
                style={styles.updateButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.updateButton.backgroundColor)
                }
                onClick={() => handleUpdateClick("spent_by_week")}
              >
                Update
              </button>
              <p style={styles.textStyle} onClick={showMonthlyYearlySpending}>
                <strong>Spent this Week:</strong>
                <span style={{ color: "red", marginLeft: "10px" }}>
                  ${numberFormat(user?.spent_by_week)}
                </span>
              </p>
            </div>
            {showMonthlySpending && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <button
                  type="button"
                  className="update-button"
                  style={styles.updateButton}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButtonHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButton.backgroundColor)
                  }
                  onClick={() => handleUpdateClick("spent_by_month")}
                >
                  Update
                </button>
                <p style={styles.textStyle}>
                  <strong>Spent this Month:</strong>
                  <span style={{ color: "red", marginLeft: "10px" }}>
                    ${numberFormat(user?.spent_by_month)}
                  </span>
                </p>
              </div>
            )}
            {showYearlySpending && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <button
                  type="button"
                  className="update-button"
                  style={styles.updateButton}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButtonHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.updateButton.backgroundColor)
                  }
                  onClick={() => handleUpdateClick("spent_by_year")}
                >
                  Update
                </button>
                <p style={styles.textStyle}>
                  <strong>Spent this Year:</strong>
                  <span style={{ color: "red", marginLeft: "10px" }}>
                    ${numberFormat(user?.spent_by_year)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
        <p style={styles.timeStyle}>
          <strong>Time:</strong> {localTime}
        </p>
      </form>

      
      {showModal && (<EnvelopeModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSendEnvelope={handleSendEnvelope}
                handleDownloadEnvelopes={handleDownloadEnvelopes}
            /> 
      )}

      {showInvestList && (
        <InvestingRecordsModal
          user={user}
          onClose={() => setShowInvestList(false)}
        />
      )}
      {showRecordList && (
        <FinancialRecordsModal
          user={user}
          onClose={() => setShowRecordList(false)}
        />
      )}
      {showNotesModal && (
        <NotesModal user={user} onClose={() => setShowNotesModal(false)} />
      )}
      {showPhotoInput && (
      <PhotoUploadModal
        onClose={() => setShowPhotoInput(false)}
        onUpload={handlePhotoUpload}
      />
    )}
      {showIncomeModal && (
        <IncomeRecordsModal
          user={user}
          onClose={() => setShowIncomeModal(false)}
        />
      )}
      {showContactsModal && (
        <ContactsModal
          user={user}
          onClose={() => setShowContactsModal(false)}
        />
      )}
      {showMeetingsModal && (
        <MeetingsModal
          user={user}
          onClose={() => setShowMeetingsModal(false)}
        />
      )}
      {/* {showInvestingComparison && (
        <InvestingComparison
          user={user}
          isOpen={showInvestingComparison}
          onClose={() => setShowInvestingComparison(false)}
        />
      )} */}
      {showSleepLogsModal && (
        <SleepLogsModal
          userId={user?.id} // Pass userId to the SleepLogsModal
          sleepLogs={sleepLogs}
          setSleepLogs={setSleepLogs} // Pass setSleepLogs to the SleepLogsModal
          onClose={() => setShowSleepLogsModal(false)}
          onSave={handleSaveSleepLog}
          onDelete={handleDeleteSleepLog}
        />
      )}
    </div>
  );
}

export default UserAccountPage;