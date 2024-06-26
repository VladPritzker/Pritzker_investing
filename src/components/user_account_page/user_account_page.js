import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FinancialRecordsModal from '../user_account_page/FinancialRecordsModal/FinancialRecordsModal';
import InvestingRecordsModal from '../user_account_page/InvestingModal/InvestingModal';
import NotesModal from '../user_account_page/Notes/notes';
import PhotoUploadModal from '../user_account_page/uploadPhoto/uploadphoto';
import IncomeRecordsModal from '../user_account_page/IncomeModal/incomeModal';
import ContactsModal from '../user_account_page/Contacts/contacts';
import MeetingsModal from './Meetings/MeetingsModal'; 
import '../user_account_page/user_account_page.css';

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

    const [showMonthlySpending, setShowMonthlySpending] = useState(false);
    const [showYearlySpending, setShowYearlySpending] = useState(false);
    const [showMonthlyIncome, setShowMonthlyIncome] = useState(false);
    const [showYearlyIncome, setShowYearlyIncome] = useState(false);

    const numberFormat = (number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(number || 0);

    useEffect(() => {
        const timer = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchTimezone = async () => {
            try {
                const response = await fetch('http://worldtimeapi.org/api/ip');
                if (!response.ok) throw new Error('Failed to fetch timezone data');
                const data = await response.json();
                const timezone = data.timezone;
                setLocalTime(new Date().toLocaleTimeString('en-US', { timeZone: timezone }));
            } catch (error) {
                console.error('Failed to fetch timezone:', error);
            }
        };

        fetchTimezone();
    }, []);

    
    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = location.state?.user;
            if (storedUser?.id) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/users/${storedUser.id}/`);
                    if (response.ok) {
                        const updatedUser = await response.json();
                        setUser(updatedUser);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [location.state?.user]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/');
    };

    const handleFinancialRecordsListClick = () => {
        setShowRecordList(true);
    };

    const showMonthlyYearlySpending = () => {
        setShowMonthlySpending(prevState => !prevState);
        setShowYearlySpending(prevState => !prevState);
    };

    const showMonthlyYearlyIncome = () => {
        setShowMonthlyIncome(prevState => !prevState);
        setShowYearlyIncome(prevState => !prevState);
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
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/`);
            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Data refreshed successfully:', updatedUser);
                setUser(updatedUser);
            } else {
                const errorData = await response.json();
                console.error('Failed to refresh data:', errorData);
                alert('Failed to refresh data.');
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
            alert('Failed to refresh data. Please try again later.');
        }
    };
    
  
    
    const handleUpdateClick = async (field) => {
        const newValue = prompt(`Enter new value for ${field}:`, user[field]);
        if (newValue !== null && newValue !== user[field]) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ [field]: newValue }),
                });
                if (response.ok) {
                    const updatedUser = await response.json();
                    console.log('Data updated successfully:', updatedUser);
                    setUser(prevUser => ({ ...prevUser, [field]: newValue }));
                } else {
                    const errorData = await response.json();
                    console.error('Failed to update data:', errorData);
                    alert('Failed to update data.');
                }
            } catch (error) {
                console.error('Error updating data:', error);
                alert('Failed to update data. Please try again later.');
            }
        }
    };

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    

    const handlePhotoUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.error('No files selected');
            return;
        }
    
        const file = files[0];
        const formData = new FormData();
        formData.append('photo', file);
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/upload_photo/`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token in the headers
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Photo uploaded successfully:', data.file_url);
                setUser(prevUser => ({ ...prevUser, photo: data.file_url }));
                setShowPhotoInput(false);
            } else {
                const errorData = await response.json();
                console.error('Failed to upload photo:', errorData);
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };
    

    const handlePhotoUploadClick = () => {
        setShowPhotoInput(true);
    };

    const goalDifference = user?.balance_goal ? (user.balance_goal - user.balance).toFixed(2) : null;

    const styles = {
        updateButton: {
            width: '60px',
            padding: "5px 5px 5px 5px",
            fontSize: '12px',
            marginRight: '10px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'                        
        },
        updateButtonHover: {
            backgroundColor: '#004494'
        },
        textStyle: {
            fontSize: '1.8em',
            marginLeft: '10px'
        },
        timeStyle: {
            fontSize: '1.5em',
            marginLeft: '-45%',
            borderBottom: 'none'
        }
    };

    const stylesUp = {
        updateButton: {
            width: '60px',
            padding: "5px 5px 5px 5px",
            fontSize: '12px',
            marginRight: '10px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '-20%'                        

        },
        updateButtonHover: {
            backgroundColor: '#004494'
        }
    };

    return (
        <div className="login-container">
            <form className="login-form">
                <div className="content-container">
                    <div className="buttons" style={{marginTop: '5%'}}>                        
                        <button className='logout' style={{marginBottom: "20%"}} onClick={handleLogout}>Logout</button>
                        {user?.photo && (
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <h2 style={{ ...styles.textStyle, marginBottom: '10px' }}>Profile Photo</h2>
                                <img src={`http://127.0.0.1:8000${user.photo}`} alt="User Photo" width="100" /> {/* Use the correct photo URL */}
                            </div>
                        )}
                         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '35%' }}>
                            <button type="button" className="upload-button" style={stylesUp.updateButton} onClick={handlePhotoUploadClick}>Upload</button>
                            <button type="button" onClick={handleRefreshDataClick} style={styles.updateButton}>Refresh</button>
                        </div>
                        
                        <button type="button" onClick={() => setShowNotesModal(true)}>Tasks</button>
                        <button type="button" onClick={handleFinancialRecordsListClick}>Spendings</button>
                        <button id="refresh" type="button" onClick={handleInvestRecordsListClick}>Investings</button>                        
                        <button id="income" type="button" onClick={handleIncomeRecordsListClick}>Income</button>
                        <button id="contacts" type="button" onClick={handleContactsListClick}>Contacts</button>
                        <button id="meetings" type="button" onClick={handleMeetingsListClick}>Meetings</button>
                    </div>
                    <div className="data-rows">
                        <h1 style={{marginLeft: '-40%'}}>User Data</h1>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('username')}>Update</button>
                            <p style={styles.textStyle}><strong>Username:</strong> {user?.username}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('email')}>Update</button>
                            <p style={styles.textStyle}><strong>Email:</strong> {user?.email}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('balance')}>Update</button>
                            <p style={styles.textStyle}><strong>Balance:</strong> ${numberFormat(user?.balance)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('balance_goal')}>Update</button>
                            <p style={styles.textStyle}>
                                <strong>Balance Goal:</strong> ${numberFormat(user?.balance_goal)}
                                <span style={{ color: "red", marginLeft: '20px' }}>
                                    {goalDifference !== null && `(${goalDifference > 0 ? '-' : '+'}$${numberFormat(Math.abs(goalDifference))})`}
                                </span>
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('money_invested')}>Update</button>
                            <p style={styles.textStyle}><strong>Money Invested:</strong> ${numberFormat(user?.money_invested)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('income_by_week')}>Update</button>
                            <p style={styles.textStyle} onClick={showMonthlyYearlyIncome}>
                                <strong>Income this week</strong>
                                <span style={{ color: "green", marginLeft: '10px' }}>${numberFormat(user?.income_by_week)}</span>
                            </p>
                        </div>
                        {showMonthlyIncome && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('income_by_month')}>Update</button>
                                <p style={styles.textStyle}>
                                    <strong>Income this Month:</strong>
                                    <span style={{ color: "green", marginLeft: '10px' }}>${numberFormat(user?.income_by_month)}</span>
                                </p>
                            </div>
                        )}
                        {showYearlyIncome && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('income_by_year')}>Update</button>
                                <p style={styles.textStyle}>
                                    <strong>Income this Year:</strong>
                                    <span style={{ color: "green", marginLeft: '10px' }}>${numberFormat(user?.income_by_year)}</span>
                                </p>
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('spent_by_week')}>Update</button>
                            <p style={styles.textStyle} onClick={showMonthlyYearlySpending}>
                                <strong>Spent this Week:</strong>
                                <span style={{ color: "red", marginLeft: '10px' }}>${numberFormat(user?.spent_by_week)}</span>
                            </p>
                        </div>
                        {showMonthlySpending && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('spent_by_month')}>Update</button>
                                <p style={styles.textStyle}>
                                    <strong>Spent this Month:</strong>
                                    <span style={{ color: "red", marginLeft: '10px' }}>${numberFormat(user?.spent_by_month)}</span>
                                </p>
                            </div>
                        )}
                        {showYearlySpending && (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('spent_by_year')}>Update</button>
                                <p style={styles.textStyle}>
                                    <strong>Spent this Year:</strong>
                                    <span style={{ color: "red", marginLeft: '10px' }}>${numberFormat(user?.spent_by_year)}</span>
                                </p>
                            </div>
                        )}
                        <p style={styles.timeStyle}><strong>Time:</strong> {localTime}</p>
                    </div>
                </div>
            </form>
            {showInvestList && (
                <InvestingRecordsModal user={user} onClose={() => setShowInvestList(false)} />
            )}
            {showRecordList && (
                <FinancialRecordsModal user={user} onClose={() => setShowRecordList(false)} />
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
                <IncomeRecordsModal user={user} onClose={() => setShowIncomeModal(false)} />
            )}
            {showContactsModal && (
                <ContactsModal user={user} onClose={() => setShowContactsModal(false)} />
            )}
            {showMeetingsModal && (
                <MeetingsModal user={user} onClose={() => setShowMeetingsModal(false)} />
            )}
        </div>
    );
}

export default UserAccountPage;
