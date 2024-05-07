import React, { useState, useEffect } from 'react';
import '../FinancialRecordsModal/FinancialRecordsModal.css';
import AddNewSpendings from '../RecordModal/RecordModal'; // 


function FinancialRecordsModal({ user, onClose }) {
    const [financialRecords, setFinancialRecords] = useState([]);
    const [displayRecords, setDisplayRecords] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [filterTitle, setFilterTitle] = useState('');
    const [roundedTotal, setRoundedTotal] = useState(0);
    const [showAddSpening, setShowAddSpending] = useState(false);


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
        const fetchFinancialRecords = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/financial_records/?user_id=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFinancialRecords(data);
                    setDisplayRecords(data); // Initially display all records
                    const totalAmount = data.reduce((total, record) => total + parseFloat(record.amount), 0);
                    const roundedTotal = Math.round(totalAmount * 100) / 100; // Round to two decimal places
                    setRoundedTotal(roundedTotal);
                } else {
                    throw new Error('Failed to fetch financial records.');
                }
            } catch (error) {
                console.error('Error fetching financial records:', error);
            }
        };

        fetchFinancialRecords();
    }, [user.id]);

    useEffect(() => {
        let filtered = financialRecords;

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
                const min = minAmount ? parseFloat(minAmount) : -Infinity;
                const max = maxAmount ? parseFloat(maxAmount) : Infinity;
                return recordAmount >= min && recordAmount <= max;
            });
            
        }
        setRoundedTotal(filtered.reduce((total, record) => total + parseFloat(record.amount), 0));
        setDisplayRecords(filtered);
    }, [startDate, endDate, financialRecords, filterTitle, minAmount, maxAmount]);

    return (
        <div className="modal">
            <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
                <h2>Spending Records List</h2>
                <div className="filters">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    
                    <input type="text" placeholder="Filter by title" value={filterTitle} onChange={e => setFilterTitle(e.target.value)} />
                    
                    <input type="number" placeholder="Min amount" value={minAmount} onChange={e => setMinAmount(e.target.value)} />
                    <input type="number" placeholder="Max amount"  value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />                    
                </div>
                <button style={{marginBottom: '10px'}} onClick={() => setShowAddSpending(true)}>Add Spenings</button>
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
                     <tfoot>
                        <tr>
                            <th>Total Amount - </th>
                            <th>{roundedTotal}</th>
                        </tr>
                    </tfoot>   
                </table>
            </div>
            {showAddSpening && <AddNewSpendings user={user} onClose={() => setShowAddSpending(false)} />}

        </div>
    );
    
}

export default FinancialRecordsModal;
