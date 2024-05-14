import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FinancialRecordsModal from '../user_account_page/FinancialRecordsModal/FinancialRecordsModal';
import InvestingRecordsModal from '../user_account_page/InvestingModal/InvestingModal';
import NotesModal from '../user_account_page/Notes/notes';

function UserAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user); // Define setUser here
    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
    const [showRecordList, setShowRecordList] = useState(false);
    const [showInvestList, setShowInvestList] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);

    const numberFormat = (number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(number);

    useEffect(() => {
        // Update the time every second
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
                const timezone = data.timezone; // Get the timezone from the API response
                setLocalTime(new Date().toLocaleTimeString('en-US', { timeZone: timezone }));
            } catch (error) {
                console.error('Failed to fetch timezone:', error);
            }
        };

        fetchTimezone();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    const handleFinancialRecordsListClick = () => {
        setShowRecordList(true);
    };
    const handleInvestRecordsListClick = () => {
        setShowInvestList(true);
    };

    const handleRefreshDataClick = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/`); // Adjust the URL to use the user ID
            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Data refreshed successfully:', updatedUser);
                setUser(updatedUser); // Update the state with the refreshed user data
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
                    // Update the specific field in the state
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

    const goalDifference = user?.balance_goal ? (user.balance_goal - user.balance).toFixed(2) : null;

    const styles = {
        updateButton: {
            width: '60px',
            padding: "5px 5px 5px 5px", /* Adjusted the left padding */
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
        }
    };
    
    return (
        <div className="login-container">
            <form className="login-form">
                <button onClick={handleLogout}>Logout</button>
                <h1>User Data</h1>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('username')}>Update</button>
                    <p style={{ marginLeft: '10px' }}><strong>Username:</strong> {user?.username}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('email')}>Update</button>
                    <p style={{ marginLeft: '10px' }}><strong>Email:</strong> {user?.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('balance_goal')}>Update</button>
                    <p style={{ marginLeft: '10px' }}>
                        <strong>Balance Goal:</strong> ${user?.balance_goal}
                        <span style={{ color: "red", marginLeft: '20px' }}>
                            {goalDifference !== null && `(${goalDifference > 0 ? '-' : '+'}$${numberFormat(Math.abs(goalDifference))})`}
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('money_invested')}>Update</button>
                    <p style={{ marginLeft: '10px' }}><strong>Money Invested:</strong> ${numberFormat(user?.money_invested)}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('balance')}>Update</button>
                    <p style={{ marginLeft: '10px' }}><strong>Balance:</strong> ${numberFormat(user?.balance)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('spent_by_week')}>Update</button>
                    <p style={{ marginLeft: '10px' }}>
                        <strong>Spent this Week:</strong>
                        <span style={{ color: "red", marginLeft: '10px' }}>${numberFormat(user?.spent_by_week)}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('spent_by_month')}>Update</button>
                    <p style={{ marginLeft: '10px' }}>
                        <strong>Spent this Month:</strong>
                        <span style={{ color: "red", marginLeft: '10px' }}>${numberFormat(user?.spent_by_month)}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button type="button" className="update-button" style={styles.updateButton} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor} onClick={() => handleUpdateClick('spent_by_year')}>Update</button>
                    <p style={{ marginLeft: '10px' }}>
                        <strong>Spent this Year:</strong>
                        <span style={{ color: "red", marginLeft: '10px' }}>${numberFormat(user?.spent_by_year)}</span>
                    </p>
                </div>
                <button type="button" style={{ marginBottom: '10px' }} onClick={() => setShowNotesModal(true)}>Show Notes</button>
                <button type="button" style={{ marginBottom: '10px' }} onClick={handleFinancialRecordsListClick}>Spending Records List</button>
                <button id="refresh" type="button" style={{ marginBottom: '50px' }} onClick={handleInvestRecordsListClick}>Investing Records List</button>
                <button type="button" style={{ marginBottom: '10px' }} onClick={handleRefreshDataClick}>Refresh data</button>
                <div className="login-form-time">
                    <div style={{ marginTop: '10px', height: "20%" }}>
                        <div>Time: {localTime}</div>
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
        </div>
    );
    
}

export default UserAccountPage;
