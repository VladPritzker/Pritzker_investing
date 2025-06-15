import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "./ActivitiesChartModal.css";

const ActivitiesChartModal = ({
  onClose,
  allActivities,
  activityTypes,
  selectedTypeFilter,
}) => {
  const [range, setRange] = useState("day");
  const [selectedYear, setYear] = useState(new Date().getFullYear());
  const [typeVisibility, setVis] = useState(
    activityTypes.reduce((a, t) => ({ ...a, [t.id]: true }), {})
  );
  const [chartData, setChartData] = useState(null);
  const [localType, setLocalType] = useState(selectedTypeFilter ?? "all");

  // ✅ Always default to [null, null], never null!
  const [dateRange, setDateRange] = useState([null, null]);

  const color = (i, total) => {
    const h = (360 / total) * i;
    return {
      backgroundColor: `hsl(${h},65%,70%)`,
      borderColor: `hsl(${h},65%,50%)`,
    };
  };

  useEffect(() => {
    setLocalType(selectedTypeFilter ?? "all");
  }, [selectedTypeFilter]);

  const buildData = useCallback(
    (acts) => {
      const lblSet = new Set();
      const count = {};
      const times = {};

      acts.forEach((a) => {
        if (!typeVisibility[a.activity_type_id]) return;

        const d = new Date(a.datetime || a.date);
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
        const day = d.toLocaleDateString("sv-SE");
        const lbl =
          range === "day"
            ? `${day} (${weekday})`
            : range === "month"
            ? d.toLocaleString("default", { month: "short" })
            : d.getFullYear().toString();

        lblSet.add(lbl);

        count[a.activity_type_id] ??= {};
        count[a.activity_type_id][lbl] =
          (count[a.activity_type_id][lbl] || 0) + 1;

        if (range === "day") {
          times[a.activity_type_id] ??= {};
          times[a.activity_type_id][lbl] ??= [];
          times[a.activity_type_id][lbl].push(d.toTimeString().slice(0, 5));
        }
      });

      const labels = [...lblSet].sort(
        (a, b) => new Date(a.split(" ")[0]) - new Date(b.split(" ")[0])
      );

      const datasets = activityTypes.map((t, i) => ({
        label: t.name,
        data: labels.map((l) => count[t.id]?.[l] || 0),
        ...color(i, activityTypes.length),
        borderWidth: 1,
        hidden: !typeVisibility[t.id],
      }));

      return { labels, datasets, times };
    },
    [activityTypes, typeVisibility, range]
  );

  useEffect(() => {
    const [from, to] = Array.isArray(dateRange) ? dateRange : [null, null];

    let filtered = allActivities.filter((a) => {
      const d = new Date(a.datetime || a.date);
      const sameY = d.getFullYear() === +selectedYear;
      const sameT = localType === "all" || a.activity_type_id === +localType;
      const inRange = (!from || d >= from) && (!to || d <= to);
      return sameY && sameT && inRange;
    });

    setChartData(buildData(filtered));
  }, [
    range,
    selectedYear,
    typeVisibility,
    allActivities,
    localType,
    dateRange,
    buildData,
  ]);

  const toggleVis = (id) => setVis((p) => ({ ...p, [id]: !p[id] }));
  const years = [selectedYear - 1, selectedYear, selectedYear + 1];

  return (
    <div className="activities-chart-overlay">
      <div className="activities-chart-modal">
        <i className="fas fa-times activities-chart-close" onClick={onClose} />
        <h3>Activities Chart</h3>

        <div className="chart-filters">
          <label>Type:</label>
          <select value={localType} onChange={(e) => setLocalType(e.target.value)}>
            <option value="all">All</option>
            {activityTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label>Range:</label>
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="month">Month</option>
            <option value="day">Day + Time</option>
            <option value="year">Year</option>
          </select>

          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <label>Date range:</label>
          <DateRangePicker
            value={dateRange}
            onChange={(value) => {
              // ✅ Ensure fallback to [null, null]
              setDateRange(Array.isArray(value) ? value : [null, null]);
            }}
            showOneCalendar
            cleanable
            style={{ width: 260 }}
          />
        </div>

        {chartData && (
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      afterBody: (ctx) => {
                        const dsIdx = ctx[0].datasetIndex;
                        const typeId = activityTypes[dsIdx].id;
                        const arr = chartData.times[typeId]?.[ctx[0].label] || [];
                        return arr.map((t) => `• ${t}`);
                      },
                    },
                  },
                  legend: {
                    onClick: (_, item) => {
                      const id = activityTypes.find((t) => t.name === item.text)?.id;
                      if (id) toggleVis(id);
                    },
                  },
                },
                scales: {
                  y: { beginAtZero: true },
                  x: { ticks: { maxRotation: 90, minRotation: 45 } },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesChartModal;