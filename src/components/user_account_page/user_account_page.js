import React, { useEffect, useState } from 'react';
import '../user_account_page/user_account_page.css';

function UserAccountPage({ userId }) {
    const [userAccount, setUserAccount] = useState({});

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://127.0.0.1:8000/account/${userId}`);
            const data = await response.json();
            setUserAccount(data);
        }
        fetchData();
    }, [userId]);

    return (
        <div className="login-container">
            <form className="login-form">
                <h1>User Data</h1>
                <p>Username: {userAccount.username}</p>
                <p>Email: {userAccount.email}</p>
                <p>Money Invested: {userAccount.money_invested}</p>
                <p>Money Spent: {userAccount.money_spent}</p>
                <p>Balance: {userAccount.balance}</p>
            </form>
        </div>
    );
}

export default UserAccountPage;
