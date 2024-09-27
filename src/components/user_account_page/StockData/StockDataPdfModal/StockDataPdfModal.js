import React, { useState, useEffect } from "react";
import "../StockData.css"; // Import the CSS file for the modal

const apiUrl = process.env.REACT_APP_API_URL;

const StockDataPdfModal = ({ isOpen, onClose }) => {
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStockData();
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.className === "stock-data-modal") {
      onClose();
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/fetch-stock-data/?symbols=TSLA,AMZN,MSFT`,
      );
      if (response.ok) {
        const data = await response.json();
        setStockData(data.data);
        setError(null);
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch stock data: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Error fetching stock data");
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await fetch(`${apiUrl}/generate-pdf/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: stockData }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "stock_data.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorText = await response.text();
        setError(`Failed to generate PDF: ${errorText}`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Error generating PDF");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="stock-data-modal" onClick={handleBackdropClick}>
      <div className="stock-data-modal-content">
        <span className="stock-data-modal-close" onClick={onClose}>
          &times;
        </span>
        <h2 className="stock-data-modal-header">Stock Data PDF</h2>
        {error && <div className="error-message">{error}</div>}
        <div>
          <button className="stock-data-modal-button" onClick={downloadPdf}>
            Download PDF
          </button>
          <div className="stock-data-scrollable">
            {stockData.map((item) => (
              <div key={item.uuid}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDataPdfModal;
