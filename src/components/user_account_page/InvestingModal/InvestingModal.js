import React, { useState, useEffect } from 'react';
import './InvestingModal.css';
import investmentTypes from './AddInvestingRecord/investmentTypes.json';
import AddInvestingRecord from './AddInvestingRecord/AddInvestingRecord';
import AddCustomCashFlowInvestment from './AddCustomCashFlowInvestment/AddCustomCashFlowInvestment';
import ConfirmDeleteModal from './ConfirmDelete/confirmDelete';
import CashFlowModal from './CashFlowModal/CashFlowModal';

const apiUrl = process.env.REACT_APP_API_URL;

function InvestingRecordsModal({ user, onClose }) {
    const [investingRecords, setInvestingRecords] = useState([]);
    const [customCashFlowInvestments, setCustomCashFlowInvestments] = useState([]);
    const [displayRecords, setDisplayRecords] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [minTenor, setMinTenor] = useState('');
    const [maxTenor, setMaxTenor] = useState('');
    const [filterTitle, setFilterTitle] = useState('');
    const [filterType, setFilterType] = useState('');
    const [roundedTotal, setRoundedTotal] = useState(0);
    const [showAddInvesting, setShowAddInvesting] = useState(false);
    const [showAddCustomCashFlow, setShowAddCustomCashFlow] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [isCashFlowModalOpen, setIsCashFlowModalOpen] = useState(false);
    const [selectedCashFlows, setSelectedCashFlows] = useState('');

    const handleClick = (cashFlows) => {
        setSelectedCashFlows(cashFlows);
        setIsCashFlowModalOpen(true);
    };

    const formatNumber = (number) => {
        return number.toLocaleString();
    };

    const fetchInvestingRecords = async () => {
        try {
            const response = await fetch(`${apiUrl}/investing_records/${user.id}/`);
            if (response.ok) {
                const data = await response.json();
                setInvestingRecords(data);
                setDisplayRecords(data);
                const totalAmount = data.reduce((total, record) => total + parseFloat(record.amount), 0);
                setRoundedTotal(Math.round(totalAmount * 100) / 100);
            } else {
                console.error('Failed to fetch investing records.');
            }
        } catch (error) {
            console.error('Error fetching investing records:', error);
        }
    };

    const fetchCustomCashFlowInvestments = async () => {
        try {
            const response = await fetch(`${apiUrl}/custom_cash_flow_investments/${user.id}/`);
            if (response.ok) {
                const data = await response.json();
                setCustomCashFlowInvestments(data);
            } else {
                console.error('Failed to fetch custom cash flow investments.');
            }
        } catch (error) {
            console.error('Error fetching custom cash flow investments:', error);
        }
    };

    useEffect(() => {
        fetchInvestingRecords();
        fetchCustomCashFlowInvestments();
    }, [user.id]);

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

    useEffect(() => {
        let filtered = investingRecords;

        if (startDate || endDate) {
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.record_date);
                const start = startDate ? new Date(startDate) : new Date(-8640000000000000);
                const end = endDate ? new Date(endDate) : new Date(8640000000000000);
                return recordDate >= start && recordDate <= end;
            });
        }

        if (filterTitle) {
            filtered = filtered.filter(record => record.title.toLowerCase().includes(filterTitle.toLowerCase()));
        }

        if (minAmount || maxAmount) {
            filtered = filtered.filter(record => {
                const recordAmount = parseFloat(record.amount);
                const min = parseFloat(minAmount) || -Infinity;
                const max = parseFloat(maxAmount) || Infinity;
                return recordAmount >= min && recordAmount <= max;
            });
        }

        if (minTenor || maxTenor) {
            filtered = filtered.filter(record => {
                const recordTenor = parseFloat(record.tenor);
                const min = parseFloat(minTenor) || -Infinity;
                const max = parseFloat(maxTenor) || Infinity;
                return recordTenor >= min && recordTenor <= max;
            });
        }

        if (filterType) {
            filtered = filtered.filter(record => record.type_invest === filterType);
        }

        setDisplayRecords(filtered);
        setRoundedTotal(filtered.reduce((total, record) => total + parseFloat(record.amount), 0));
    }, [startDate, endDate, filterTitle, minAmount, maxAmount, minTenor, maxTenor, filterType, investingRecords]);

    const deleteRecord = async (id, isCustom = false) => {
        try {
            const endpoint = isCustom ? 'custom_cash_flow_investments' : 'investing_records';
            const response = await fetch(`${apiUrl}/${endpoint}/${user.id}/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                if (isCustom) {
                    setCustomCashFlowInvestments(customCashFlowInvestments.filter(record => record.id !== id));
                } else {
                    setInvestingRecords(investingRecords.filter(record => record.id !== id));
                    setDisplayRecords(displayRecords.filter(record => record.id !== id));
                }
                const totalAmount = displayRecords.reduce((total, record) => total + parseFloat(record.amount), 0);
                setRoundedTotal(Math.round(totalAmount * 100) / 100);
            } else {
                console.error('Failed to delete investing record.');
            }
        } catch (error) {
            console.error('Error deleting investing record:', error);
        }
    };

    const handleDeleteClick = (record, isCustom = false) => {
        setRecordToDelete({ ...record, isCustom });
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            deleteRecord(recordToDelete.id, recordToDelete.isCustom);
            setShowConfirmDelete(false);
            setRecordToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmDelete(false);
        setRecordToDelete(null);
    };

    const CashFlowWithTooltip = ({ cashFlows }) => {
        try {
            const parsedCashFlows = JSON.parse(cashFlows);
            const cashFlowsString = parsedCashFlows.join(', ');
            const truncated = cashFlowsString.length > 5 ? cashFlowsString.substring(0, 5) + '...' : cashFlowsString;
            return (
                <span onClick={() => handleClick(cashFlowsString)} style={{ cursor: 'pointer', position: 'relative' }}>
                    {truncated}
                </span>
            );
        } catch (e) {
            console.error('Error parsing cash flows:', e);
            return '';
        }
    };

    const style = {
        padding: "20px",
        background: '#f8f9fa',
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "1200px",
        margin: "auto",
        overflow: "hidden",
        animation: "formAnimation 0.3s ease-out",
        position: "relative",
        marginTop: '5%'
    }

    return (
        <div className="modal">
            <div className="modal-content" style={style}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Fixed Rate Investments</h2>
                <div className="filters">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    <input type="text" placeholder="Filter by title" value={filterTitle} onChange={e => setFilterTitle(e.target.value)} />
                    <input type="number" placeholder="Min amount" value={minAmount} onChange={e => setMinAmount(e.target.value)} />
                    <input type="number" placeholder="Max amount" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                    <input type="number" placeholder="Min tenor" value={minTenor} onChange={e => setMinTenor(e.target.value)} />
                    <input type="number" placeholder="Max tenor" value={maxTenor} onChange={e => setMaxTenor(e.target.value)} />
                    <div className="select-container">
                        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option value="">All Types</option>
                            {Object.entries(investmentTypes).map(([type, details]) => (
                                <option key={type} value={type}>{type} (Rate: {details.rate})</option>
                            ))}
                        </select>
                    </div>
                    <button style={{ marginBottom: '10px' }} onClick={() => setShowAddInvesting(true)}>Add Fixed Rate Investment</button>
                </div>
                <table className="financial-records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Tenor</th>
                            <th>Type</th>
                            <th>Income at Maturity</th>
                            <th>Amount at Maturity</th>
                            <th>Maturity date</th>
                            <th>Discount Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRecords.map(record => (
                            <tr key={record.id}>
                                <td>{record.title}</td>
                                <td>{formatNumber(record.amount)}</td>
                                <td>{record.record_date}</td>
                                <td>{record.tenor ? formatNumber(record.tenor) : ''}</td>
                                <td>{record.type_invest}</td>
                                <td>{record.yearly_income}</td>
                                <td>{record.amount_at_maturity ? formatNumber(record.amount_at_maturity) : ''}</td>
                                <td>{record.maturity_date}</td>
                                <td>{record.discount_rate ? formatNumber(record.discount_rate) : ''}</td>
                                <td>
                                    <button onClick={() => handleDeleteClick(record)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total Amount</th>
                            <th>{formatNumber(roundedTotal)}</th>
                        </tr>
                    </tfoot>
                </table>

                <h2>Custom Cash Flow Investments</h2>
                <button style={{ marginBottom: '10px' }} onClick={() => setShowAddCustomCashFlow(true)}>Add Custom Cash Flow Investment</button>
                <table className="financial-records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Tenor</th>
                            <th>Type</th>
                            <th>Cash Flows</th>
                            <th>Discount Rate</th>
                            <th>NPV</th>
                            <th>IRR</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customCashFlowInvestments.map(record => (
                            <tr key={record.id}>
                                <td>{record.title}</td>
                                <td>{formatNumber(record.amount)}</td>
                                <td>{record.record_date}</td>
                                <td>{record.tenor ? formatNumber(record.tenor) : ''}</td>
                                <td>{record.type_invest}</td>
                                <td>{record.cash_flows ? <CashFlowWithTooltip cashFlows={record.cash_flows} /> : ''}</td>
                                <td>{record.discount_rate ? formatNumber(record.discount_rate) : ''}</td>
                                <td>{record.NPV ? formatNumber(record.NPV) : ''}</td>
                                <td>{record.IRR ? formatNumber(record.IRR) : ''}</td>
                                <td>
                                    <button onClick={() => handleDeleteClick(record, true)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showAddInvesting && <AddInvestingRecord user={user} onClose={() => { setShowAddInvesting(false); fetchInvestingRecords(); }} fetchInvestingRecords={fetchInvestingRecords} />}
            {showAddCustomCashFlow && <AddCustomCashFlowInvestment user={user} onClose={() => { setShowAddCustomCashFlow(false); fetchCustomCashFlowInvestments(); }} fetchCustomCashFlowInvestments={fetchCustomCashFlowInvestments} />}
            {showConfirmDelete && <ConfirmDeleteModal onClose={cancelDelete} onConfirm={confirmDelete} />}
            <CashFlowModal isOpen={isCashFlowModalOpen} onClose={() => setIsCashFlowModalOpen(false)} cashFlows={selectedCashFlows} />
        </div>
    );
}

export default InvestingRecordsModal;
