import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "./ChartModal.css"; // Import the CSS file

Chart.register(...registerables, annotationPlugin);

const ChartModal = ({ sleepLogs, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterLogsByPeriod = (logs) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return logs.filter(
        (log) => new Date(log.date) >= start && new Date(log.date) <= end,
      );
    }
    return logs;
  };

  const filteredLogs = filterLogsByPeriod(sleepLogs);

  const data = {
    labels: filteredLogs.map((log) => log.date),
    datasets: [
      {
        label: "Sleep Time",
        data: filteredLogs.map(
          (log) =>
            new Date(log.sleep_time).getHours() +
            new Date(log.sleep_time).getMinutes() / 60,
        ),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderCapStyle: "butt",
      },
      {
        label: "Wake Time",
        data: filteredLogs.map(
          (log) =>
            new Date(log.wake_time).getHours() +
            new Date(log.wake_time).getMinutes() / 60,
        ),
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderCapStyle: "butt",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: "linear",
        min: 0,
        max: 24,
        ticks: {
          callback: function (value) {
            const hours = Math.floor(value);
            const minutes = (value - hours) * 60;
            return `${hours}:${minutes === 0 ? "00" : minutes}`;
          },
        },
        title: {
          display: true,
          text: "Time (24 hours)",
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 22, // 10 PM
            yMax: 22,
            borderColor: "green",
            borderWidth: 2,
            label: {
              content: "10 PM",
              enabled: true,
              position: "start",
              backgroundColor: "green",
            },
          },
          line2: {
            type: "line",
            yMin: 6, // 6 AM
            yMax: 6,
            borderColor: "green",
            borderWidth: 2,
            label: {
              content: "6 AM",
              enabled: true,
              position: "start",
              backgroundColor: "green",
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const hours = Math.floor(value);
            const minutes = Math.round((value - hours) * 60);
            return `${context.dataset.label}: ${hours}:${minutes === 0 ? "00" : minutes < 10 ? "0" + minutes : minutes}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-modal-overlay">
      <div className="chart-modal-container">
        <i className="fas fa-times chart-modal-close" onClick={onClose}></i>
        <h2>Sleep Log Chart</h2>
        <div className="date-range-inputs">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartModal;
