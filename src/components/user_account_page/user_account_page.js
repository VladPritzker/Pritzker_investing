import React, { useState, useEffect } from 'react';
import RecordModal from './RecordModal/RecordModal';
import FinancialRecordsModal from '../user_account_page/FinancialRecordsModal/FinancialRecordsModal';
import InvestingRecordsModal from '../user_account_page/InvestingModal/InvestingModal';
import AddInvestingRecord from  '../user_account_page/AddInvestingRecord/AddInvestingRecord';
import { useLocation, useNavigate } from 'react-router-dom';


function UserAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user); // Define setUser here
    const [token, setToken] = useState(localStorage.getItem('userToken'));


    const [showAddRecordModal, setShowAddRecordModal] = useState(false);
    const [showRecordList, setShowRecordList] = useState(false);
    const [showInvestList, setShowInvestList] = useState(false);
    const [showAddInvestRecordModal, setShowAddInvestRecordModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    const handleAddRecordClick = (e) => {
        e.preventDefault();  // Prevents the default form submission behavior
        setShowAddRecordModal(true);
    };

    const handleFinancialRecordsListClick = () => {
        setShowRecordList(true);
    };
    const handleInvestRecordsListClick = () => {
        setShowInvestList(true);
    };

    const handleAddInvestRecordClick = () => {
        setShowAddInvestRecordModal(true);
    }

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
                <h1>User Data</h1>
                <p>Username: {user?.username}</p>
                <p>Email: {user?.email}</p>
                <p>Money Invested: {user?.money_invested}</p>
                <p>Money Spent: {user?.money_spent}</p>
                <p>Balance: {user?.balance}</p>
                <p>Goal: 200 000</p>
                <button type="button" style={{ marginBottom: '10px',  marginTop: '20px' }} >Add Money to Balance</button>
                <button type="button" style={{ marginBottom: '10px', }} onClick={handleAddRecordClick}>Add Spending Record</button>
                <button type="button" style={{ marginBottom: '50px' }} onClick={handleFinancialRecordsListClick}>Spending Records List</button>

                <button type="button" style={{ marginBottom: '10px' }}onClick={handleAddInvestRecordClick} >Add Investing Record</button>
                <button id="refresh" type="button" style={{ marginBottom: '50px' }} onClick={handleInvestRecordsListClick}>Investing Records List</button>

                <button type="button" style={{ marginBottom: '10px' }} onClick={handleRefreshDataClick}>Refresh data</button>
                <button onClick={handleLogout}>Logout</button>
            </form>
            {showAddRecordModal && (
                <RecordModal user={user} onClose={() => setShowAddRecordModal(false)}  />
            )}
            {showInvestList && (
                <InvestingRecordsModal user={user} onClose={() => setShowInvestList(false)} />
            )}
            {showRecordList && (
                <FinancialRecordsModal user={user} onClose={()=> setShowRecordList(false)} />
            )}
            {showAddInvestRecordModal && (
                <AddInvestingRecord user={user} onClose={() => setShowAddInvestRecordModal(false)}/>
            )}


        </div>
    );
}

export default UserAccountPage;
