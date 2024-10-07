import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const apiUrl = process.env.REACT_APP_API_URL;

function ExchangeLinkTokenModal({ onClose, onExchange }) {
  const [publicToken, setPublicToken] = useState('');
  const [linkToken, setLinkToken] = useState('');

  useEffect(() => {
    // Fetch the link token from the backend when the component mounts
    const fetchLinkToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/create_link_token/`, {
          credentials: 'include', // Include credentials if needed
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
  
  // Use PlaidLink hook with the fetched link token
  const onSuccess = (public_token, metadata) => {
    setPublicToken(public_token);
    console.log('Public Token:', public_token);
  };

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (publicToken) {
      await onExchange(publicToken);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Exchange Public Token</h2>

        {/* Button to open the Plaid Link widget */}
        <button onClick={() => open()} disabled={!ready}>
          Open Plaid Link to Get Public Token
        </button>

        {/* Form to submit the public token for exchange */}
        <form onSubmit={handleSubmit}>
          <label>
            Public Token:
            <input
              type="text"
              value={publicToken}
              onChange={(e) => setPublicToken(e.target.value)}
              required
              readOnly // Public token will be set automatically after Plaid Link success
            />
          </label>
          <button type="submit">Exchange Token</button>
        </form>
      </div>
    </div>
  );
}

export default ExchangeLinkTokenModal;
