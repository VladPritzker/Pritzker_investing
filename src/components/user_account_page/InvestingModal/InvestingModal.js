import React, { useState, useEffect } from 'react';
import './InvestingModal.css'; // Assume similar styling to FinancialRecordsModal or customize as needed

function InvestingRecordsModal({ user, onClose }) {
    const [investingRecords, setInvestingRecords] = useState([]);
    const [displayRecords, setDisplayRecords] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        title: ''
    });

    // Fetching records from the backend
    useEffect(() => {
        const fetchInvestingRecords = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/investing_records/?user_id=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setInvestingRecords(data);
                    setDisplayRecords(data);
                } else {
                    throw new Error('Failed to fetch investing records.');
                }
            } catch (error) {
                console.error('Error fetching investing records:', error);
            }
        };

        fetchInvestingRecords();
    }, [user.id]);

    // Handling filter changes
    useEffect(() => {
        let filtered = investingRecords.filter(record => {
            const recordDate = new Date(record.record_date);
            const start = filterCriteria.startDate ? new Date(filterCriteria.startDate) : new Date(-8640000000000000);
            const end = filterCriteria.endDate ? new Date(filterCriteria.endDate) : new Date(8640000000000000);
            const amount = parseFloat(record.amount);
            const minAmount = filterCriteria.minAmount ? parseFloat(filterCriteria.minAmount) : -Infinity;
            const maxAmount = filterCriteria.maxAmount ? parseFloat(filterCriteria.maxAmount) : Infinity;
            return record.title.toLowerCase().includes(filterCriteria.title.toLowerCase()) &&
                   recordDate >= start && recordDate <= end &&
                   amount >= minAmount && amount <= maxAmount;
        });

        setDisplayRecords(filtered);
    }, [filterCriteria, investingRecords]);

    // Render component
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Investing Records List</h2>
                <div className="filters">
                    <input type="date" value={filterCriteria.startDate} onChange={e => setFilterCriteria({...filterCriteria, startDate: e.target.value})} />
                    <input type="date" value={filterCriteria.endDate} onChange={e => setFilterCriteria({...filterCriteria, endDate: e.target.value})} />
                    <input type="text" placeholder="Filter by title" value={filterCriteria.title} onChange={e => setFilterCriteria({...filterCriteria, title: e.target.value})} />
                    <input type="number" placeholder="Min amount" value={filterCriteria.minAmount} onChange={e => setFilterCriteria({...filterCriteria, minAmount: e.target.value})} />
                    <input type="number" placeholder="Max amount" value={filterCriteria.maxAmount} onChange={e => setFilterCriteria({...filterCriteria, maxAmount: e.target.value})} />
                </div>
                <table className="financial-records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRecords.map(record => (
                            <tr key={record.id}>
                                <td>{record.title}</td>
                                <td>{record.amount}</td>
                                <td>{record.record_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InvestingRecordsModal;
