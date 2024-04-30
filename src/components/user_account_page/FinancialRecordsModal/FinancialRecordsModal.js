import React, { useState, useEffect } from 'react';
import '../FinancialRecordsModal/FinancialRecordsModal.css';

function FinancialRecordsModal({ user, onClose }) {
    const [financialRecords, setFinancialRecords] = useState([]);
    const [roundedTotal, setRoundedTotal] = useState(0);

    useEffect(() => {
        // Fetch financial records data for the user
        const fetchFinancialRecords = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/financial_records/?user_id=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFinancialRecords(data);
                    const totalAmount = data.reduce((total, record) => total + parseFloat(record.amount), 0);
                    const roundedTotal = Math.round(totalAmount * 100) / 100; // Round to two decimal places
                    setRoundedTotal(roundedTotal);
                } else {
                    throw new Error('Failed to fetch financial records.');
                }
            } catch (error) {
                console.error('Error fetching financial records:', error);
                // Handle error, e.g., display an error message
            }
        };

        fetchFinancialRecords();
    }, [user.id]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Financial Records List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financialRecords.map(record => (
                            <tr key={record.id}>
                                <td style={{ border: '1px solid black' }}>{record.title}</td>
                                <td style={{ border: '1px solid black' }}>{record.amount}</td>
                                <td style={{ border: '1px solid black' }}>{record.record_date}</td>
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
        </div>
    );
}

export default FinancialRecordsModal;
