import React, { useState, useEffect } from 'react';
import './IncomeRecordsModal.css';
import AddRecordModal from '../IncomeModal/addIncomeRecrd/addIncomeRecrd';
import IncomeChartModal from '../IncomeModal/incomeChart/incomeChart';

function IncomeRecordsModal({ user, onClose }) {
    const [incomeRecords, setIncomeRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [titleFilter, setTitleFilter] = useState('');
    const [minAmountFilter, setMinAmountFilter] = useState('');
    const [maxAmountFilter, setMaxAmountFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [showAddRecordModal, setShowAddRecordModal] = useState(false);
    const [showChartModal, setShowChartModal] = useState(false);

    useEffect(() => {
        const fetchIncomeRecords = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/income_records/`);
                if (response.ok) {
                    const data = await response.json();
                    setIncomeRecords(data);
                    setFilteredRecords(data);
                } else {
                    throw new Error('Failed to fetch income records.');
                }
            } catch (error) {
                console.error('Error fetching income records:', error);
            }
        };

        fetchIncomeRecords();
    }, [user.id]);

    useEffect(() => {
        let filtered = incomeRecords;

        if (titleFilter) {
            filtered = filtered.filter(record => record.title.toLowerCase().includes(titleFilter.toLowerCase()));
        }

        if (minAmountFilter || maxAmountFilter) {
            filtered = filtered.filter(record => {
                const amount = parseFloat(record.amount);
                const min = minAmountFilter ? parseFloat(minAmountFilter) : -Infinity;
                const max = maxAmountFilter ? parseFloat(maxAmountFilter) : Infinity;
                return amount >= min && amount <= max;
            });
        }

        if (startDateFilter || endDateFilter) {
            filtered = filtered.filter(record => {
                const date = new Date(record.record_date);
                const start = startDateFilter ? new Date(startDateFilter) : new Date(-8640000000000000);
                const end = endDateFilter ? new Date(endDateFilter) : new Date(8640000000000000);
                return date >= start && date <= end;
            });
        }

        setFilteredRecords(filtered);
    }, [titleFilter, minAmountFilter, maxAmountFilter, startDateFilter, endDateFilter, incomeRecords]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleClearFilters = () => {
        setTitleFilter('');
        setMinAmountFilter('');
        setMaxAmountFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
    };

    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${user.id}/delete_income/${recordToDelete.id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setIncomeRecords(incomeRecords.filter(record => record.id !== recordToDelete.id));
                setFilteredRecords(filteredRecords.filter(record => record.id !== recordToDelete.id));
                setShowDeleteModal(false);
                setRecordToDelete(null);
            } else {
                throw new Error('Failed to delete income record.');
            }
        } catch (error) {
            console.error('Error deleting income record:', error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setRecordToDelete(null);
    };

    const handleAddRecordClick = () => {
        setShowAddRecordModal(true);
    };

    const handleRecordAdded = (newRecord) => {
        const formattedRecord = {
            ...newRecord,
            record_date: new Date(newRecord.record_date).toISOString().split('T')[0]
        };
        setIncomeRecords([...incomeRecords, formattedRecord]);
        setFilteredRecords([...filteredRecords, formattedRecord]);
    };

    const handleShowChartClick = () => {
        setShowChartModal(true);
    };

    const totalIncome = filteredRecords.reduce((total, record) => total + parseFloat(record.amount), 0).toFixed(2);

    return (
        <div className="income-modal">
            <div className="income-modal-content">
                <span className="income-close" onClick={onClose}>&times;</span>
                <h2>Income Records</h2>
                <div className="income-filters">
                    <input type="text" placeholder="Filter by title" value={titleFilter} onChange={e => setTitleFilter(e.target.value)} />
                    <input type="number" placeholder="Min amount" value={minAmountFilter} onChange={e => setMinAmountFilter(e.target.value)} />
                    <input type="number" placeholder="Max amount" value={maxAmountFilter} onChange={e => setMaxAmountFilter(e.target.value)} />
                    <input type="date" value={startDateFilter} onChange={e => setStartDateFilter(e.target.value)} />
                    <input type="date" value={endDateFilter} onChange={e => setEndDateFilter(e.target.value)} />
                    <button onClick={handleAddRecordClick}>Add New Record</button>
                    <button onClick={handleClearFilters}>Clear Filters</button>
                    <button onClick={handleShowChartClick}>Show Chart</button>
                </div>

                <div className="income-records-table-container">
                    <table className="income-records-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.slice(0, 5).map(record => (
                                <tr key={record.id}>
                                    <td>{record.title}</td>
                                    <td>{record.amount}</td>
                                    <td>{new Date(record.record_date).toISOString().split('T')[0]}</td>
                                    <td>
                                        <button style={{width: '40%', paddingRight: '35px', backgroundColor: '#0056b3', color: 'white', border: 'none' }} onClick={() => handleDeleteClick(record)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ backgroundColor: '#0056b3', color: 'white' }}>
                                <td colSpan="3"><strong>Total Income:</strong></td>
                                <td>{totalIncome}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            {showAddRecordModal && (
                <AddRecordModal
                    user={user}
                    onClose={() => setShowAddRecordModal(false)}
                    onRecordAdded={handleRecordAdded}
                />
            )}
            {showChartModal && (
                <IncomeChartModal
                    user={user}
                    incomeRecords={incomeRecords}
                    onClose={() => setShowChartModal(false)}
                />
            )}
            {showDeleteModal && (
                <div className="income-delete-modal">
                    <div className="income-delete-modal-content">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this record?</p>
                        <button onClick={handleDeleteConfirm}>Yes</button>
                        <button onClick={handleDeleteCancel}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncomeRecordsModal;
