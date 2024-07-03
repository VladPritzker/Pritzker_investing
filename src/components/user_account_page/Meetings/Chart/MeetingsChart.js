import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './MeetingsChart.css';

const MeetingsChart = ({ meetings, onClose }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const titles = meetings.map(meeting => meeting.title);
        const dates = meetings.map(meeting => new Date(meeting.datetime).toLocaleDateString());
        const doneStatuses = meetings.map(meeting => meeting.done ? 1 : 0);

        setChartData({
            labels: dates,
            datasets: [
                {
                    label: 'Meetings',
                    data: doneStatuses,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    fill: false,
                },
            ],
        });
    }, [meetings]);

    return (
        <div className="chart-modal">
            <div className="chart-modal-content">
                <span className="chart-close" onClick={onClose}>&times;</span>
                <h2>Meetings Chart</h2>
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default MeetingsChart;
