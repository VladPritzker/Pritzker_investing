import React, { useState, useEffect } from 'react';
import './InvestingComparison.css'; // Import the CSS file for the modal
import ChartModal from './ChartModal/ChartModal'; // Import the ChartModal component

const apiUrl = process.env.REACT_APP_API_URL;

const StockDataModal = ({ isOpen, onClose }) => {
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState('price');

  useEffect(() => {
    if (isOpen) {
      fetchStockDataFromDb();
    }
  }, [isOpen]);

  const fetchStockDataFromApi = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stock-data/`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchStockDataFromDb();
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch and post stock data: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching and posting stock data:', error);
      setError('Error fetching and posting stock data');
    }
  };

  const fetchStockDataFromDb = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stock-data/`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setStockData(data);
        setError(null);
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch stock data from database: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching stock data from database:', error);
      setError('Error fetching stock data from database');
    }
  };

  const deleteStockData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stock-data/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStockData([]);
        console.log('Stock data successfully deleted');
      } else {
        const errorText = await response.text();
        console.error('Error deleting stock data:', errorText);
      }
    } catch (error) {
      console.error('Error deleting stock data:', error);
    }
  };

  const openChartModal = () => {
    setChartData(stockData);
    setIsChartModalOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  const filterOptions = ['price', 'day_high', 'day_low', 'day_open', 'week_52_high', 'week_52_low', 'previous_close_price', 'day_change', 'volume'];

  return (
    <div className="stock-data-modal">
      <div className="stock-data-modal-content">
        <span className="stock-data-modal-close" onClick={onClose}>&times;</span>
        <h2 className="stock-data-modal-header">Stock Data</h2>
        <button className="stock-data-modal-button" onClick={fetchStockDataFromApi}>Fetch and Post Data</button>
        <button className="stock-data-modal-button" onClick={deleteStockData}>Delete All Data</button>
        <button className="stock-data-modal-button" onClick={openChartModal}>Open Chart</button>
        <select
          className="stock-data-modal-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {error && <div className="error-message">{error}</div>}
        {stockData.length > 0 && (
          <div>
            <h3>Stock Data</h3>
            <ul className="stock-data-list">
              {stockData.map((item) => (
                
                <li key={item.id}>                  
                  {item.name}: {item[filter]} : {item.date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isChartModalOpen && (
        <ChartModal
          isOpen={isChartModalOpen}
          onClose={() => setIsChartModalOpen(false)}
          data={chartData}
          filter={filter}
          filterOptions={filterOptions}
        />
      )}
    </div>
  );
};

export default StockDataModal;
