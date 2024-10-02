import React, { useState, useEffect } from "react";
import "./AddCustomCashFlowInvestment.css";
import investmentTypes from "../AddInvestingRecord/investmentTypes.json"; // Adjust the path as necessary
import { npv, irr } from "financial";

const apiUrl = process.env.REACT_APP_API_URL;

function AddCustomCashFlowInvestment({
  user,
  onClose,
  token,
  // fetchInvestingRecords,
}) {
  const [recordName, setRecordName] = useState("");
  const [recordAmount, setRecordAmount] = useState("");
  const [recordTenor, setRecordTenor] = useState("");
  const [recordTypeInvest, setRecordTypeInvest] = useState("");
  const [manualRate, setManualRate] = useState("");
  const [cashFlows, setCashFlows] = useState([]);
  const [npvValue, setNpvValue] = useState(null);
  const [irrValue, setIrrValue] = useState(null);

  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)",
    );
    return cookieValue ? cookieValue.pop() : "";
  }

  const handleSaveInvestRecord = async (recordData) => {
    try {
      const response = await fetch(
        `${apiUrl}/custom_cash_flow_investments/${user.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Assuming token authentication
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify(recordData),
        },
      );

      if (response.ok) {
        alert("Record added successfully!");
        // fetchInvestingRecords(); // Fetch the updated records list
        onClose(); // Close the modal after adding the record
      } else {
        const errorData = await response.json();
        alert(`Failed to add record: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    }
  };

  const handleAddRecord = async () => {
    if (!user) return;
    if (
      recordName.trim() === "" ||
      isNaN(recordAmount) ||
      recordAmount.trim() === ""
    ) {
      alert("Please ensure all fields are filled out correctly.");
      return;
    }
    if (recordTypeInvest.trim() === "") {
      alert("Please select a valid investment type");
      return;
    }
    if (manualRate.trim() === "" || isNaN(manualRate)) {
      alert("Please enter a valid rate.");
      return;
    }

    const recordData = {
      user_id: user.id,
      title: recordName,
      amount: parseFloat(recordAmount),
      record_date: new Date().toISOString().slice(0, 10), // Ensure correct formatting
      tenor: recordTenor, // Ensure this is a number if required by backend
      type_invest: recordTypeInvest, // Ensure this matches one of the expected types
      cash_flows: JSON.stringify(cashFlows.map((cf) => parseFloat(cf))), // Parse each cash flow to float and convert to JSON string
      discount_rate: parseFloat(manualRate), // Discount rate instead of rate
      NPV: npvValue,
      IRR: irrValue,
    };

    handleSaveInvestRecord(recordData);
  };

  const calculateNPVandIRR = (flows, rate) => {
    const discountRate = parseFloat(rate) / 100;
    const npvCalc = npv(discountRate, flows);
    const irrCalc = irr(flows);

    setNpvValue(npvCalc.toFixed(2));
    setIrrValue((irrCalc * 100).toFixed(2));
  };

  useEffect(() => {
    if (recordTenor && recordAmount) {
      const years = parseInt(recordTenor);
      if (!isNaN(years) && years > 0) {
        const initialInvestment = -Math.abs(parseFloat(recordAmount));
        const flows = [initialInvestment, ...new Array(years).fill("")];
        setCashFlows(flows);
      }
    }
  }, [recordTenor, recordAmount]);

  useEffect(() => {
    if (cashFlows.length > 0 && manualRate) {
      const parsedCashFlows = cashFlows.map(parseFloat);
      if (!parsedCashFlows.includes(NaN)) {
        calculateNPVandIRR(parsedCashFlows, manualRate);
      }
    }
  }, [cashFlows, manualRate]);

  const handleInvestmentTypeChange = (type) => {
    setRecordTypeInvest(type);
  };

  const handleCashFlowChange = (index, value) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);

    const parsedCashFlows = newCashFlows.map(parseFloat);
    if (!parsedCashFlows.includes(NaN)) {
      calculateNPVandIRR(parsedCashFlows, manualRate);
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

  const style = {
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "900px",
    margin: "auto",
    overflow: "hidden",
    animation: "formAnimation 0.3s ease-out",
    position: "relative",
    marginTop: "5%",
  };

  return (
    <div className="custom-modal">
      <div className="custom-modal-content" style={style}>
        <span className="custom-close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Custom Cash Flow Investment</h2>
        <input
          type="text"
          placeholder="Record Name"
          value={recordName}
          onChange={(e) => setRecordName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={recordAmount}
          onChange={(e) => setRecordAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Tenor (years)"
          value={recordTenor}
          onChange={(e) => setRecordTenor(e.target.value)}
        />
        <div className="custom-select-container">
          <select onChange={(e) => handleInvestmentTypeChange(e.target.value)}>
            <option value="">Select Investment Type</option>
            {Object.entries(investmentTypes).map(([type, details]) => (
              <option key={type} value={type}>
                {type}{" "}
                <span style={{ color: "green" }}>(Rate: {details.rate})</span>
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter Rate (%)"
            value={manualRate}
            onChange={(e) => setManualRate(e.target.value)}
          />
        </div>
        {cashFlows.map((cf, index) => (
          <div key={index}>
            <input
              type="number"
              placeholder={`Cash Flow ${index === 0 ? "(Initial Investment)" : index}`}
              value={cf}
              onChange={(e) => handleCashFlowChange(index, e.target.value)}
              readOnly={index === 0} // Initial investment should not be editable
            />
          </div>
        ))}
        {npvValue && <p>NPV: ${npvValue}</p>}
        {irrValue && <p>IRR: {irrValue}%</p>}
        <button type="button" onClick={handleAddRecord}>
          Post
        </button>
      </div>
    </div>
  );
}

export default AddCustomCashFlowInvestment;
