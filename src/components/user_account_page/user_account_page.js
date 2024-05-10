import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FinancialRecordsModal from '../user_account_page/FinancialRecordsModal/FinancialRecordsModal';
import InvestingRecordsModal from '../user_account_page/InvestingModal/InvestingModal';
import NotesModal from '../user_account_page/Notes/notes'






function UserAccountPage() {

    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user); // Define setUser here
    const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());



    const [showRecordList, setShowRecordList] = useState(false);
    const [showInvestList, setShowInvestList] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);

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
                setUser(updatedUser);  // Update the state with the refreshed user data
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
    return (
        <div className="login-container">
                <form className="login-form">                
                <button onClick={handleLogout}>Logout</button>
                <h1>User Data</h1>
                <p>Username: {user?.username}</p>
                <p>Email: {user?.email}</p>
                <p>Goal: 200 000</p>
                <p>Money Invested: {user?.money_invested}</p>
                <p>Money Spent: {user?.money_spent}</p>
                <p>Balance: {user?.balance}</p>
                <button type="button" style={{ marginBottom: '10px', }} onClick={() => setShowNotesModal(true)}>Show Notes</button>
                
                <button type="button" style={{ marginBottom: '50px' }} onClick={handleFinancialRecordsListClick}>Spending Records List</button>

                <button id="refresh" type="button" style={{ marginBottom: '50px' }} onClick={handleInvestRecordsListClick}>Investing Records List</button>            
                <button type="button" style={{ marginBottom: '10px' }} onClick={handleRefreshDataClick}>Refresh data</button>
                <div className="login-form-time">
                    <div style={{marginTop: '10px', height: "20%"}}>
                        <div>Time: {localTime}</div>                    
                    </div>                    
                </div>
            </form>
            {showInvestList && (
                <InvestingRecordsModal user={user} onClose={() => setShowInvestList(false)} />
            )}            
            {showRecordList && (
                <FinancialRecordsModal user={user} onClose={()=> setShowRecordList(false)} />
            )}        
            {showNotesModal && (
                <NotesModal user={user} onClose={() => setShowNotesModal(false)}/>
            )}
        </div>
    );
}

export default UserAccountPage;
