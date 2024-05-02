import React, { useState, useEffect } from 'react';
import RecordModal from './RecordModal/RecordModal';
import FinancialRecordsModal from '../user_account_page/FinancialRecordsModal/FinancialRecordsModal';
import InvestingRecordsModal from '../user_account_page/InvestingModal/InvestingModal';

import { useLocation, useNavigate } from 'react-router-dom';


function UserAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user); // Define setUser here

    const [showAddRecordModal, setShowAddRecordModal] = useState(false);
    const [showRecordList, setShowRecordList] = useState(false);
    const [showInvestList, setShowInvestList] = useState(false);

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
    
    


    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    const handleSaveRecord = async (recordData) => {
        try {
            const csrftoken = getCookie('csrftoken'); // Obtain CSRF token from cookies
            const response = await fetch('http://127.0.0.1:8000/financial_records/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken 
                },
                body: JSON.stringify(recordData)
            });

            if (response.ok) {
                alert('Record added successfully!');
                setShowAddRecordModal(false);
            } else {
                const errorData = await response.json();
                alert(`Failed to add record: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            alert(`Network error: ${error.message}`);
            console.log(recordData)
        }
    };

    const handleCloseRecordsModal = () => {
        setShowRecordList(false);  // This function will be passed to the modal to close it
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
                <button type="button" style={{ marginBottom: '10px' }} onClick={handleAddRecordClick}>Add Spending Record</button>
                <button type="button" style={{ marginBottom: '50px' }} onClick={handleFinancialRecordsListClick}>Spending Records List</button>

                <button type="button" style={{ marginBottom: '10px' }} >Add Investing Record</button>
                <button id="refresh" type="button" style={{ marginBottom: '50px' }} onClick={handleInvestRecordsListClick}>Investing Records List</button>

                <button type="button" style={{ marginBottom: '10px' }} onClick={handleRefreshDataClick}>Refresh data</button>
                <button onClick={handleLogout}>Logout</button>
            </form>
            {showAddRecordModal && (
                <RecordModal user={user} onClose={() => setShowAddRecordModal(false)} onSave={handleSaveRecord} />
            )}
            {showInvestList && (
                <InvestingRecordsModal user={user} onClose={() => setShowInvestList(false)} onSave={handleSaveRecord} />
            )}
            {showRecordList && (
                <FinancialRecordsModal user={user} onClose={handleCloseRecordsModal} />
            )}

        </div>
    );
}

export default UserAccountPage;
