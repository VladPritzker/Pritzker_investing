import React, { useState, useEffect } from 'react';
import './StockDataModal.css'; // Import the CSS file for the modal
import ChartModal from './ChartModal/ChartModal'; // Import the ChartModal component
const apiUrl = process.env.REACT_APP_API_URL;

const StockDataModal = ({ isOpen, onClose }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [filter, setFilter] = useState('price');

  useEffect(() => {
    if (isOpen) {
      fetchStockData();
    }
  }, [isOpen]);

  const fetchStockData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stock-data`);
      if (response.ok) {
        const data = await response.json();
        setStockData(data.data);
        setError(null);
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch stock data: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Error fetching stock data');
    }
  };

  const openChartModal = () => {
    setChartData(stockData);
    setIsChartModalOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  const filterOptions = ['price', 'day_high', 'day_low', 'day_open', '52_week_high', '52_week_low', 'previous_close_price', 'day_change', 'volume'];

  return (
    <div className="stock-data-modal">
      <div className="stock-data-modal-content">
        <span className="stock-data-modal-close" onClick={onClose}>&times;</span>
        <h2 className="stock-data-modal-header">Stock Data</h2>
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
        {stockData && (
          <div>
            <h3>Stock Data</h3>
            <ul className="stock-data-list">
              {stockData.map((item) => (
                <li key={item.ticker}>
                  {item.name}: {item[filter]}
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
