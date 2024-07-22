import React, { useState, useEffect, useCallback } from 'react';
import './StockData.css'; // Import the CSS file for the modal
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
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target.className === 'stock-data-modal') {
      onClose();
    }
  };

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

  const openChartModal = () => {
    setChartData(stockData);
    setIsChartModalOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  const filterOptions = ['price', 'day_high', 'day_low', 'day_open', 'week_52_high', 'week_52_low', 'previous_close_price', 'day_change', 'volume'];

  // Group stock data by date and filter duplicates
  const groupedStockData = stockData.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString();
    const key = `${item.name}-${date}`;
    if (!acc[date]) {
      acc[date] = { items: [], seen: new Set() };
    }
    if (!acc[date].seen.has(key)) {
      acc[date].items.push(item);
      acc[date].seen.add(key);
    }
    return acc;
  }, {});

  return (
    <div className="stock-data-modal" onClick={handleBackdropClick}>
      <div className="stock-data-modal-content">
        <span className="stock-data-modal-close" onClick={onClose}>&times;</span>
        <h2 className="stock-data-modal-header">Stock Data</h2>
        <button className="stock-data-modal-button" onClick={fetchStockDataFromApi}>Fetch and Post Data</button>
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
        {Object.keys(groupedStockData).length > 0 && (
          <div>
            <h3>Stock Data</h3>
            {Object.keys(groupedStockData).map(date => (
              <div key={date}>
                <h4>{date}</h4>
                <ul className="stock-data-list">
                  {groupedStockData[date].items.map(item => (
                    <li key={item.id}>
                      {item.name}: {item[filter]} : {item.date}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
