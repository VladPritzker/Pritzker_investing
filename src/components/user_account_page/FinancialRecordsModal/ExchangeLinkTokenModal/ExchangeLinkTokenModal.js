import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import "./ExchangeLinkTokenModal.css"

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function ExchangeLinkTokenModal({ onClose, user_id }) {
  const [linkToken, setLinkToken] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/create_link_token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id }),  // Include user_id in request body
        });
        const data = await response.json();
        if (response.ok) {
          setLinkToken(data.link_token);
        } else {
          console.error('Error fetching link token:', data.error);
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };

    fetchLinkToken();
  }, [user_id]);

  const onSuccess = async (public_token) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/get_access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token, user_id }),  // Include user_id
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Access token exchange successful:', data);
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

    try {
      const response = await fetch(`${apiUrl}/get_account_data/?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAccounts(data.accounts);
      } else {
        console.error('Error fetching accounts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelection = (account_id) => {
    setSelectedAccounts((prevSelected) => {
      if (prevSelected.includes(account_id)) {
        return prevSelected.filter((id) => id !== account_id);
      } else {
        return [...prevSelected, account_id];
      }
    });
  };

  const saveSelectedAccounts = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/save_selected_accounts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_ids: selectedAccounts, user_id }),  // Include user_id
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Selected accounts saved successfully:', data);
        // Optionally, close the modal or redirect the user
        onClose();
      } else {
        console.error('Error saving selected accounts:', data.error);
      }
    } catch (error) {
      console.error('Error saving selected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const config = linkToken
    ? {
        token: linkToken,
        onSuccess,
        onExit: (err) => {
          if (err) console.error('Link flow exited with error:', err);
        },
      }
    : null;

  const { open, ready } = usePlaidLink(config || {});

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Connect Your Bank Account</h2>
        {loading && <div className="spinner">Loading...</div>}
        {!loading && !accounts.length && (
          <button onClick={() => open()} disabled={!ready}>
            Open Plaid Link
          </button>
        )}
        {accounts && accounts.length > 0 && (
          <div>
            <h3>Select Accounts to Track</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveSelectedAccounts();
              }}
            >
              <div className="accounts-list">
                {accounts.map((account) => (
                  <div key={account.account_id} className="account-item">
                    <span>
                      {account.name} ending with {account.mask}
                    </span>
                    <input
                      type="checkbox"
                      value={account.account_id}
                      checked={selectedAccounts.includes(account.account_id)}
                      onChange={() => handleAccountSelection(account.account_id)}
                    />
                  </div>
                ))}
              </div>
              <button type="submit">Save Selected Accounts</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExchangeLinkTokenModal;
