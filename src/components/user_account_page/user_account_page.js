import React, { useState } from 'react';
import RecordModal from './RecordModal/RecordModal';
import { useLocation, useNavigate } from 'react-router-dom';

function UserAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [showAddRecordModal, setShowAddRecordModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    const handleAddRecordClick = (event) => {
        event.preventDefault();  // Prevents the default form submission behavior
        setShowAddRecordModal(true);
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
                headers: { 'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken },
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
    
    return (
        <div className="login-container">
            <form className="login-form">
            <h1>User Data</h1>
                <p>Username: {user?.username}</p>
                <p>Email: {user?.email}</p>
                <p>Money Invested: {user?.money_invested}</p>
                <p>Money Spent: {user?.money_spent}</p>
                <p>Balance: {user?.balance}</p>
                <button type="button" style={{ marginBottom: '10px' }} onClick={handleAddRecordClick}>Add Record</button>

                <button onClick={handleLogout}>Logout</button>
            </form>
            {showAddRecordModal && (
                <RecordModal user={user} onClose={() => setShowAddRecordModal(false)} onSave={handleSaveRecord} />
            )}
        </div>
    );
}

export default UserAccountPage;
