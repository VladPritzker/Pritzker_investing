import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function ExchangeLinkTokenModal({ onClose }) {
  const [linkToken, setLinkToken] = useState('');
  const [accounts, setAccounts] = useState(null); // For storing the fetched account data

  useEffect(() => {
    // Fetch the link token from the backend when the component mounts
    const fetchLinkToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/create_link_token/`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.link_token) {
          setLinkToken(data.link_token);
        } else {
          console.error('Error fetching link token:', data.error);
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };

    fetchLinkToken();
  }, []);

  const onSuccess = async (public_token) => {
    console.log('Public Token:', public_token);

    // Exchange the public token for an access token
    try {
      const response = await fetch(`${apiUrl}/get_access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Access token exchange successful:', data);

        // Fetch account data after exchanging the public token
        fetchAccountData();
      } else {
        console.error('Error exchanging public token:', data.error);
      }
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${apiUrl}/get_account_data/`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setAccounts(data.accounts);
      } else {
        console.error('Error fetching accounts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const config = {
    token: linkToken,
    onSuccess,
    onExit: (err, metadata) => {
      if (err) {
        console.error('Link flow exited with error:', err);
      } else {
        console.log('Link flow exited:', metadata);
      }
    },
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Connect Your Bank Account</h2>

        {/* Button to open the Plaid Link widget */}
        <button onClick={() => open()} disabled={!ready}>
          Open Plaid Link
        </button>

        {/* Display accounts after they are fetched */}
        {accounts && accounts.length > 0 && (
          <div>
            <h3>Accounts</h3>
            <ul>
              {accounts.map((account, index) => (
                <li key={index}>
                  <strong>{account.name}</strong>: ${account.balances.current}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExchangeLinkTokenModal;
