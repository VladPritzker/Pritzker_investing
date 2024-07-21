import React, { useState, useEffect } from 'react';
import './ChartModal.css'; // Import the CSS file for the modal
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ChartModal = ({ isOpen, onClose, data, filter, filterOptions }) => {
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered);

      const companyNames = Array.from(new Set(data.map(item => item.name)));
      setSelectedCompanies(companyNames);
    }
  }, [data, startDate, endDate]);

  const handleCompanyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCompanies(prev =>
      checked ? [...prev, value] : prev.filter(company => company !== value)
    );
  };

  if (!isOpen) {
    return null;
  }

  const colors = [
    'rgba(75,192,192,1)',
    'rgba(192,75,192,1)',
    'rgba(192,192,75,1)',
    'rgba(75,75,192,1)',
    'rgba(192,75,75,1)',
    'rgba(75,192,75,1)',
  ];

  const chartData = {
    labels: filteredData
      ? Array.from(new Set(filteredData.map(item => new Date(item.date).toLocaleDateString())))
      : [],
    datasets: selectedCompanies.map((company, index) => {
      const companyData = filteredData.filter(item => item.name === company);
      return {
        label: `${company} ${selectedFilter}`,
        data: companyData.map(item => item[selectedFilter]),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.2)'),
        fill: false,
      };
    }),
  };

  return (
    <div className="chart-modal">
      <div className="chart-modal-content">
        <span className="chart-modal-close" onClick={onClose}>&times;</span>
        <h2 className="chart-modal-header">Stock Chart</h2>
        <div className="chart-modal-filters">
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            onClickOutside={() => setStartDate(startDate)} // Ensure the box doesn't leave unwanted UI elements
            onCalendarClose={() => setStartDate(startDate)} // Ensure the box doesn't leave unwanted UI elements
          />
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            onClickOutside={() => setEndDate(endDate)} // Ensure the box doesn't leave unwanted UI elements
            onCalendarClose={() => setEndDate(endDate)} // Ensure the box doesn't leave unwanted UI elements
          />
          <label>Filter by:</label>
          <select
            className="chart-modal-select"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <label>Select Companies:</label>
          <div className="chart-modal-companies">
            {Array.from(new Set(data.map(item => item.name))).map(company => (
              <div key={company} className="chart-modal-company">
                <input
                  type="checkbox"
                  value={company}
                  checked={selectedCompanies.includes(company)}
                  onChange={handleCompanyChange}
                />
                {company}
              </div>
            ))}
          </div>
        </div>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default ChartModal;
