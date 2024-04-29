import React, { useEffect, useState } from 'react';
import '../user_account_page/user_account_page.css';
import { useLocation, useNavigate } from 'react-router-dom';




function UserAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state?.user;

    const handleLogout = () => {
        // Assuming you might store a user token or any other auth-related info:
        localStorage.removeItem('userToken'); // or clear other authentication details
        navigate('/login'); // Redirect to login page after clearing auth details
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
                <button type="button" onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </form>
        </div>
    );
}

export default UserAccountPage;
