import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import '../incomeChart/incomeChart.css';

function IncomeChartModal({ user, incomeRecords, onClose }) {
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filter, setFilter] = useState('week');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const now = new Date();
        let filtered;

        switch (filter) {
            case 'day':
                const lastWeek = new Date();
                lastWeek.setDate(now.getDate() - 7);
                filtered = getDatesInRange(lastWeek, now).map(date => {
                    const record = incomeRecords.find(record => new Date(record.record_date).toDateString() === date.toDateString());
                    return {
                        record_date: date,
                        amount: record ? record.amount : 0
                    };
                });
                break;
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                filtered = getDatesInRange(startOfWeek, now).map(date => {
                    const record = incomeRecords.find(record => new Date(record.record_date).toDateString() === date.toDateString());
                    return {
                        record_date: date,
                        amount: record ? record.amount : 0
                    };
                });
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = getDatesInRange(startOfMonth, now).map(date => {
                    const record = incomeRecords.find(record => new Date(record.record_date).toDateString() === date.toDateString());
                    return {
                        record_date: date,
                        amount: record ? record.amount : 0
                    };
                });
                break;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                filtered = getDatesInRange(startOfYear, now).map(date => {
                    const record = incomeRecords.find(record => new Date(record.record_date).toDateString() === date.toDateString());
                    return {
                        record_date: date,
                        amount: record ? record.amount : 0
                    };
                });
                break;
            default:
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    filtered = getDatesInRange(start, end).map(date => {
                        const record = incomeRecords.find(record => new Date(record.record_date).toDateString() === date.toDateString());
                        return {
                            record_date: date,
                            amount: record ? record.amount : 0
                        };
                    });
                } else {
                    filtered = incomeRecords;
                }
        }

        setFilteredRecords(filtered);
    }, [filter, startDate, endDate, incomeRecords]);

    const getDatesInRange = (start, end) => {
        const dates = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const data = {
        labels: filteredRecords.map(record => new Date(record.record_date).toLocaleDateString()),
        datasets: [
            {
                label: 'Income',
                data: filteredRecords.map(record => record.amount),
                fill: false,
                borderColor: 'green'
            }
        ]
    };

    const filtersStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        position: 'relative',
        margin: '20px auto',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-around'
    };

    return (
        <div className="modal">
            <div className="modal-content" style={{ marginTop: '10%' }}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Income Chart</h2>
                <div className="filters-chart" style={filtersStyle}>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="day"
                            checked={filter === 'day'}
                            onChange={() => setFilter('day')}
                        /> Day
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="week"
                            checked={filter === 'week'}
                            onChange={() => setFilter('week')}
                        /> Week
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="month"
                            checked={filter === 'month'}
                            onChange={() => setFilter('month')}
                        /> Month
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="year"
                            checked={filter === 'year'}
                            onChange={() => setFilter('year')}
                        /> Year
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="custom"
                            checked={filter === 'custom'}
                            onChange={() => setFilter('custom')}
                        /> Custom
                    </label>
                </div>
                {filter === 'custom' && (
                    <div className="date-range-filters" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                )}
                <Line data={data} />
            </div>
        </div>
    );
}

export default IncomeChartModal;
