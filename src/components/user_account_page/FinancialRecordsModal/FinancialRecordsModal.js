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
import "./FinancialRecordsModal.css";
import AddNewSpendings from "../RecordModal/RecordModal";
import MonthlyExpensesModal from "./Monthly_Expenses/Monthly_Expenses";
import ConfirmDeleteModal from "../FinancialRecordsModal/deletConf/deleteConf.js";
import ChartModal from "./spendingsChart/spendingsChart.js";
import ExchangeLinkTokenModal from './ExchangeLinkTokenModal/ExchangeLinkTokenModal.js';

const apiUrl = process.env.REACT_APP_API_URL;

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

function FinancialRecordsModal({ user, onClose }) {
  const [financialRecords, setFinancialRecords] = useState([]);
  const [displayRecords, setDisplayRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [roundedTotal, setRoundedTotal] = useState(0);
  const [showAddSpending, setShowAddSpending] = useState(false);
  const [showMonthlyExpenses, setShowMonthlyExpenses] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [filterType, setFilterType] = useState("date");
  const [showExchangeTokenModal, setShowExchangeTokenModal] = useState(false);


  const csrftoken = getCookie('csrftoken');

const exchangePublicToken = async (publicToken) => {
  try {
    const response = await fetch(`${apiUrl}/exchange_public_token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ public_token: publicToken }),
      credentials: 'include',
    });
    // ... rest of the code
  } catch (error) {
    console.error('Error exchanging public token:', error);
  }
};

  


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const fetchFinancialRecords = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/financial_records/?user_id=${user.id}`,
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the data to check structure
        setFinancialRecords(data);
        setDisplayRecords(data);
        const totalAmount = data.reduce(
          (total, record) => total + parseFloat(record.amount),
          0,
        );
        const roundedTotal = Math.round(totalAmount * 100) / 100; // Round to two decimal places
        setRoundedTotal(roundedTotal);
      } else {
        throw new Error("Failed to fetch financial records.");
      }
    } catch (error) {
      console.error("Error fetching financial records:", error);
    }
  };


  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  useEffect(() => {
    fetchFinancialRecords();
  }, [user.id]);

  useEffect(() => {
    let filtered = financialRecords;

    if (startDate || endDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.record_date);
        const start = startDate
          ? new Date(startDate)
          : new Date(-8640000000000000);
        const end = endDate ? new Date(endDate) : new Date(8640000000000000);
        return recordDate >= start && recordDate <= end;
      });
    }

    if (filterTitle) {
      filtered = filtered.filter((record) =>
        record.title.toLowerCase().includes(filterTitle.toLowerCase()),
      );
    }

    if (minAmount || maxAmount) {
      filtered = filtered.filter((record) => {
        const recordAmount = parseFloat(record.amount);
        const min = minAmount ? parseFloat(minAmount) : -Infinity;
        const max = maxAmount ? parseFloat(maxAmount) : Infinity;
        return recordAmount >= min && recordAmount <= max;
      });
    }

    setRoundedTotal(
      filtered.reduce((total, record) => total + parseFloat(record.amount), 0),
    );
    setDisplayRecords(filtered);
  }, [startDate, endDate, financialRecords, filterTitle, minAmount, maxAmount]);

  const handleAddSpendingClose = () => {
    setShowAddSpending(false);
    fetchFinancialRecords(); // Refresh financial records list after adding a new record
  };

  const handleMonthlySpenidngClose = () => {
    setShowMonthlyExpenses(false);
    fetchFinancialRecords(); // Refresh financial records list after adding a new record
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/financial_records/${user.id}/${recordToDelete.id}/`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setShowDeleteModal(false);
        fetchFinancialRecords(); // Refresh the list after deletion
      } else {
        console.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  const handleChartModalOpen = () => {
    setShowChartModal(true);
  };

  const handleChartModalClose = () => {
    setShowChartModal(false);
  };

  const getFilteredRecords = () => {
    let filtered = [...displayRecords];

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (filterType) {
      case "week":
        filtered = filtered.filter(
          (record) => new Date(record.record_date) >= startOfWeek,
        );
        break;
      case "month":
        filtered = filtered.filter(
          (record) => new Date(record.record_date) >= startOfMonth,
        );
        break;
      case "year":
        filtered = filtered.filter(
          (record) => new Date(record.record_date) >= startOfYear,
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  const getChartData = () => {
    const filteredRecords = getFilteredRecords();
    const groupedByDate = filteredRecords.reduce((acc, record) => {
      const date = new Date(record.record_date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    const dates = Object.keys(groupedByDate).sort();
    const amounts = dates.map((date) =>
      groupedByDate[date].reduce(
        (sum, record) => sum + parseFloat(record.amount),
        0,
      ),
    );
    const tooltipLabels = dates.map((date) => groupedByDate[date]);

    return {
      labels: dates,
      datasets: [
        {
          label: "Spending Over Time",
          data: amounts,
          fill: false,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          tooltipLabels: tooltipLabels, // Attach the tooltip labels
        },
      ],
    };
  };

  const clearAllFilters = () => {
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setFilterTitle("");
  };

  const style = {
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "800px",
    margin: "auto",
    overflow: "hidden",
    animation: "formAnimation 0.3s ease-out",
    position: "relative",
    marginTop: "5%",
  };

  return (
    <div className="modal">
      <div className="modal-content" style={style}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Spending Records List</h2>
        <div className="filters">
        <button style={{ marginBottom: "10px" }} onClick={() => setShowExchangeTokenModal(true)}>Exchange Link Token</button>
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
          <input
            type="text"
            placeholder="Filter by title"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => setShowAddSpending(true)}
        >
          Add Spending
        </button>
        <button
          style={{ marginBottom: "10px" }}
          onClick={() => setShowMonthlyExpenses(true)}
        >
          Monthly Expenses
        </button>
        <button style={{ marginBottom: "10px" }} onClick={handleChartModalOpen}>
          Show Chart
        </button>
        <button style={{ marginBottom: "10px" }} onClick={clearAllFilters}>
          Clear All Filters
        </button>
        <table className="financial-records-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.title}</td>
                <td>{record.amount}</td>
                <td>{record.record_date}</td>
                <td>
                  <button
                    style={{ width: "80%" }}
                    onClick={() => handleDeleteClick(record)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Total Amount - </th>
              <th>{roundedTotal}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      {showAddSpending && (
        <AddNewSpendings user={user} onClose={handleAddSpendingClose} />
      )}
      {showMonthlyExpenses && (
        <MonthlyExpensesModal
          user={user}
          onClose={handleMonthlySpenidngClose}
        />
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          record={recordToDelete}
        />
      )}

      {showChartModal && (
        <ChartModal
          onClose={handleChartModalClose}
          chartData={getChartData()}
          filterType={filterType}
          setFilterType={setFilterType}
          records={financialRecords} // Pass the financial records to ChartModal
        />
      )}
      {showExchangeTokenModal && (
      <ExchangeLinkTokenModal
        onClose={() => setShowExchangeTokenModal(false)}
        onExchange={exchangePublicToken}
      />
      )}
    </div>
  );
}

export default FinancialRecordsModal;
