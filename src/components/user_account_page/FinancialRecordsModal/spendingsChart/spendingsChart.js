import React from 'react';
import { Line } from 'react-chartjs-2';
import '../spendingsChart/spendingsChart.css';

function ChartModal({ onClose, chartData, filterType, setFilterType, records }) {
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const dataset = context.dataset;
                        const dataIndex = context.dataIndex;
                        const date = context.label;
                        const amount = context.raw;
                        const record = dataset.tooltipLabels[dataIndex].find(
                            r => parseFloat(r.amount) === amount
                        );

                        if (record) {
                            return `${record.title}: $${record.amount} on ${record.record_date}`;
                        } else {
                            return `No record found for ${date}`;
                        }
                    },
                },
            },
        },
    };

    return (
        <div className="chart-modal">
            <div className="chart-modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Spending Chart</h2>
                <div className="chart-filters">
                    <label>
                        <input
                            type="radio"
                            name="filterType"
                            value="date"
                            checked={filterType === 'date'}
                            onChange={e => setFilterType(e.target.value)}
                        />
                        Date
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filterType"
                            value="week"
                            checked={filterType === 'week'}
                            onChange={e => setFilterType(e.target.value)}
                        />
                        Week
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filterType"
                            value="month"
                            checked={filterType === 'month'}
                            onChange={e => setFilterType(e.target.value)}
                        />
                        Month
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filterType"
                            value="year"
                            checked={filterType === 'year'}
                            onChange={e => setFilterType(e.target.value)}
                        />
                        Year
                    </label>
                </div>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

export default ChartModal;