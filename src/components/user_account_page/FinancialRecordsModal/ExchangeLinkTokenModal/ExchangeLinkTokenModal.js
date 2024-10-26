import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function ExchangeLinkTokenModal({ onClose }) {
  const [linkToken, setLinkToken] = useState('');
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }
      // console.log('Auth Token found in sessionStorage:', token);

      try {
        const response = await fetch(`${apiUrl}/create_link_token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.link_token) {
          setLinkToken(data.link_token);
          // console.log('Link token fetched:', data.link_token);
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
    setLoading(true);

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found in sessionStorage');
      return;
    }

    // console.log('Auth Token for exchanging public token:', token);
    // console.log('Plaid Public Token received from onSuccess:', public_token);

    try {
      const response = await fetch(`${apiUrl}/get_access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ public_token }),
      });

      const data = await response.json();

      // console.log('Response from /get_access_token/:', response);
      // console.log('Response data from /get_access_token/:', data);

      if (response.ok) {
        console.log('Access token exchange successful:', data);
        sessionStorage.setItem('accessToken', data.access_token);
        fetchAccountData();
      } else {
        console.error('Error exchanging public token:', data.error);
      }
    } catch (error) {
      console.error('Error exchanging public token:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountData = async () => {
    setLoading(true);
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    // console.log('Access Token for fetching account data:', accessToken);

    try {
      const response = await fetch(`${apiUrl}/get_account_data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccounts(data.accounts);
        // console.log('Accounts fetched:', data.accounts);
      } else {
        console.error('Error fetching accounts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const config = linkToken
    ? {
        token: linkToken,
        onSuccess,
        onExit: (err, metadata) => {
          if (err) {
            console.error('Link flow exited with error:', err);
          } else {
            console.log('Link flow exited:', metadata);
          }
        },
      }
    : null;

  const { open, ready } = usePlaidLink(config || {});

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Connect Your Bank Account</h2>

        {loading && <div className="spinner">Loading...</div>}

        {!loading && (
          <button onClick={() => open()} disabled={!ready}>
            Open Plaid Link
          </button>
        )}

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
