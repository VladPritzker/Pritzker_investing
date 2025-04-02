import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./ActivitiesChartModal.css";

const ActivitiesChartModal = ({
  onClose,
  allActivities,
  activityTypes,
}) => {
  const [range, setRange] = useState("month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [typeVisibility, setTypeVisibility] = useState(
    activityTypes.reduce((acc, type) => ({ ...acc, [type.id]: true }), {})
  );
  const [chartData, setChartData] = useState(null);

  const generateUniqueColor = (index, total) => {
    const hue = (360 / total) * index;
    return {
      backgroundColor: `hsl(${hue}, 65%, 70%)`,
      borderColor: `hsl(${hue}, 65%, 50%)`,
    };
  };

  useEffect(() => {
    const filteredActivities = allActivities.filter(
      (act) => new Date(act.date).getFullYear() === parseInt(selectedYear)
    );
    setChartData(buildChartData(filteredActivities));
  }, [range, selectedYear, typeVisibility, allActivities]);

  const buildChartData = (activities) => {
    const labelsSet = new Set();
    const datasetsMap = {};

    activities.forEach((act) => {
      if (!typeVisibility[act.activity_type_id]) return;

      const dateObj = new Date(act.date);
      let label;
      if (range === "day") label = dateObj.toISOString().split("T")[0];
      else if (range === "month")
        label = dateObj.toLocaleString("default", { month: "short" });
      else if (range === "year") label = dateObj.getFullYear().toString();

      labelsSet.add(label);

      if (!datasetsMap[act.activity_type_id]) {
        datasetsMap[act.activity_type_id] = {};
      }
      datasetsMap[act.activity_type_id][label] =
        (datasetsMap[act.activity_type_id][label] || 0) + 1;
    });

    const labels = Array.from(labelsSet).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const datasets = activityTypes.map((type, idx) => {
      const colors = generateUniqueColor(idx, activityTypes.length);
      return {
        label: type.name,
        data: labels.map((lbl) => datasetsMap[type.id]?.[lbl] || 0),
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 1,
        hidden: !typeVisibility[type.id],
      };
    });

    return { labels, datasets };
  };

  const toggleVisibility = (typeId) => {
    setTypeVisibility((prev) => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  const years = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  return (
    <div className="activities-chart-overlay">
      <div className="activities-chart-modal">
        <i className="fas fa-times activities-chart-close" onClick={onClose} />
        <h3>Activities Chart</h3>

        <div className="chart-filters">
          <label>Range:</label>
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>

          <label>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="chart-container" style={{ marginTop: "1rem" }}>
          {chartData && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    onClick: (_, legendItem) => {
                      const typeId = activityTypes.find(
                        (t) => t.name === legendItem.text
                      )?.id;
                      if (typeId) toggleVisibility(typeId);
                    },
                  },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesChartModal;
