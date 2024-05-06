import React, { useState, useEffect } from 'react';
import '../InvestingModal/InvestingModal.css';
import investmentTypes from '../AddInvestingRecord/investmentTypes.json';


function InvestingRecordsModal({ user, onClose }) {
    const [investingRecords, setInvestingRecords] = useState([]);
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

    

    useEffect(() => {
        const fetchInvestingRecords = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/investing_records/?user_id=${user.id}`);
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

        fetchInvestingRecords();
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

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Investing Records List</h2>
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
                            {Object.entries(investmentTypes).map(([type, id]) => (
                                <option key={id} value={id}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <table className="financial-records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Tenor</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRecords.map(record => (
                            <tr key={record.id}>
                                <td>{record.title}</td>
                                <td>{record.amount}</td>
                                <td>{record.record_date}</td>
                                <td>{record.tenor}</td>
                                <td>{record.type_invest}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total Amount</th>
                            <th>{roundedTotal}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default InvestingRecordsModal;
