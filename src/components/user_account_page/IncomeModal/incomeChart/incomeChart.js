import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../incomeChart/incomeChart.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function IncomeChartModal({ user, incomeRecords, onClose }) {
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filter, setFilter] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setFilterDates();
  }, [filter]);

  useEffect(() => {
    filterRecords();
  }, [filter, startDate, endDate, incomeRecords]);

  const setFilterDates = () => {
    const now = new Date();
    let start, end;

    switch (filter) {
      case "day":
        start = now;
        end = now;
        break;
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - now.getDay()); // Sunday of the current week
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Saturday of the current week
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1); // First day of the current year
        end = new Date(now.getFullYear(), 11, 31); // Last day of the current year
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const filterRecords = () => {
    let filtered;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filterByDateRange(start, end);
    } else {
      filtered = incomeRecords;
    }

    setFilteredRecords(filtered);
  };

  const filterByDateRange = (start, end) => {
    return incomeRecords
      .filter((record) => {
        const recordDate = new Date(record.record_date);
        return recordDate >= start && recordDate <= end;
      })
      .sort((a, b) => new Date(a.record_date) - new Date(b.record_date));
  };

  const getLabelsForDateRange = (start, end) => {
    const labels = [];
    let current = new Date(start);

    while (current <= end) {
      labels.push(current.toLocaleDateString("en-US"));
      current.setDate(current.getDate() + 1);
    }

    return labels;
  };

  const getDataForDateRange = (start, end, records) => {
    const data = [];
    let current = new Date(start);

    while (current <= end) {
      const record = records.find(
        (record) =>
          new Date(record.record_date).toDateString() ===
          current.toDateString(),
      );
      const value = record ? parseFloat(record.amount) : 0;
      data.push(value);
      current.setDate(current.getDate() + 1);
    }

    return data;
  };

  const trimDataPoints = (labels, data) => {
    let start = 0;
    let end = data.length - 1;

    while (start < data.length && data[start] === 0) {
      start++;
    }
    while (end >= 0 && data[end] === 0) {
      end--;
    }

    return {
      labels: labels.slice(start, end + 1),
      data: data.slice(start, end + 1),
    };
  };

  const labels = getLabelsForDateRange(new Date(startDate), new Date(endDate));
  const dataPoints = getDataForDateRange(
    new Date(startDate),
    new Date(endDate),
    filteredRecords,
  );
  const trimmedData = trimDataPoints(labels, dataPoints);

  const data = {
    labels: trimmedData.labels,
    datasets: [
      {
        label: "Income",
        data: trimmedData.data,
        fill: false,
        borderColor: "#0F52BA", // Sapphire color
        spanGaps: true, // Do not span gaps where data is null
      },
    ],
  };

  const options = {
    scales: {
      x: {
        reverse: false, // Ensure the x-axis is not reversed
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += context.raw;
            return label;
          },
          title: function (context) {
            return context[0].label; // Use the formatted date for tooltip title
          },
        },
      },
    },
  };

  const filtersStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "800px",
    position: "relative",
    margin: "20px auto",
    textAlign: "center",
    display: "flex",
    justifyContent: "space-around",
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ marginTop: "10%" }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Income Chart</h2>
        <div className="filters-chart" style={filtersStyle}>
          <label>
            <input
              type="radio"
              name="filter"
              value="day"
              checked={filter === "day"}
              onChange={() => setFilter("day")}
            />{" "}
            Day
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="week"
              checked={filter === "week"}
              onChange={() => setFilter("week")}
            />{" "}
            Week
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="month"
              checked={filter === "month"}
              onChange={() => setFilter("month")}
            />{" "}
            Month
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="year"
              checked={filter === "year"}
              onChange={() => setFilter("year")}
            />{" "}
            Year
          </label>
        </div>
        <div
          className="date-range-filters"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default IncomeChartModal;
