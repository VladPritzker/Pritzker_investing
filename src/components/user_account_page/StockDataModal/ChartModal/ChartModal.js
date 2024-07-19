import React, { useState } from 'react';
import './ChartModal.css'; // Import the CSS file for the modal
import { Line } from 'react-chartjs-2';

const ChartModal = ({ isOpen, onClose, data, filter, filterOptions }) => {
  const [selectedFilter, setSelectedFilter] = useState(filter);

  if (!isOpen) {
    return null;
  }

  const chartData = {
    labels: data ? data.map(item => item.name) : [],
    datasets: [
      {
        label: `Stock ${selectedFilter}`,
        data: data ? data.map(item => item[selectedFilter]) : [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return (
    <div className="chart-modal">
      <div className="chart-modal-content">
        <span className="chart-modal-close" onClick={onClose}>&times;</span>
        <h2 className="chart-modal-header">Stock Chart</h2>
        <select
          className="chart-modal-select"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filterOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default ChartModal;
