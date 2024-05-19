import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FinancialRecordsModal from '../user_account_page/FinancialRecordsModal/FinancialRecordsModal';
import InvestingRecordsModal from '../user_account_page/InvestingModal/InvestingModal';
import NotesModal from '../user_account_page/Notes/notes';
import PhotoUploadModal from '../user_account_page/uploadPhoto/uploadphoto';
import IncomeRecordsModal from '../user_account_page/IncomeModal/incomeModal'; // Import the new component
import '../user_account_page/user_account_page.css';

function UserAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Initialize as null
    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
    const [showRecordList, setShowRecordList] = useState(false);
    const [showInvestList, setShowInvestList] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showPhotoInput, setShowPhotoInput] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false); // State for showing income modal

    const [showMonthlySpending, setShowMonthlySpending] = useState(false);
    const [showYearlySpending, setShowYearlySpending] = useState(false);

    const numberFormat = (number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(number);

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
            const storedUser = location.state?.user; // Get the user from location state
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
        navigate('/login');
    };

    const handleFinancialRecordsListClick = () => {
        setShowRecordList(true);
    };

    const showMonthlyYearlySpending = () => {
        if (!showMonthlySpending && !showYearlySpending) {
            setShowMonthlySpending(true);
            setShowYearlySpending(true);
            return;
        } 
        else if (showMonthlySpending && showYearlySpending) {
            setShowMonthlySpending(false);
            setShowYearlySpending(false);
            return;
        }    
    };

    const handleInvestRecordsListClick = () => {
        setShowInvestList(true);
    };

    const handleIncomeRecordsListClick = () => {
        setShowIncomeModal(true);
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
            fontSize: '1.8em', // Similar to h2 font size
            marginLeft: '10px'
        },
        timeStyle: {
            fontSize: '1.5em', // Similar to h2 font size
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
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '35%' }}>
                            <button type="button" className="upload-button" style={stylesUp.updateButton} onClick={handlePhotoUploadClick}>Upload</button>
                            <button type="button" onClick={handleRefreshDataClick} style={styles.updateButton}>Refresh</button>
                        </div>
                        {user?.photo && (
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <h2 style={{ ...styles.textStyle, marginBottom: '10px' }}>Profile Photo</h2>
                                <img src={`http://127.0.0.1:8000/media/${user.photo}`} alt="User Photo" width="100" />
                            </div>
                        )}
                        <button className='logout' style={{marginBottom: "20%"}} onClick={handleLogout}>Logout</button>
                        <button type="button" onClick={() => setShowNotesModal(true)}>Tasks</button>
                        <button type="button" onClick={handleFinancialRecordsListClick}>Spendings</button>
                        <button id="refresh" type="button" onClick={handleInvestRecordsListClick}>Investings</button>                        
                        <button id="income" type="button" onClick={handleIncomeRecordsListClick}>Income</button> {/* New button for income records */}
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
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('income_amount')}>Update</button>
                            <p style={styles.textStyle}><strong>Income:</strong> ${numberFormat(user?.income_amount)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('balance')}>Update</button>
                            <p style={styles.textStyle}><strong>Balance:</strong> ${numberFormat(user?.balance)}</p>
                        </div>
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
        </div>
    );
}

export default UserAccountPage;
