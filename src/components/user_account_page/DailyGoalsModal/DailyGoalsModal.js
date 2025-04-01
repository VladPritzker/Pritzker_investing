import React, { useState, useEffect, useCallback } from "react";
import "./DailyGoalsModal.css";
const apiUrl = process.env.REACT_APP_API_URL;

function DailyGoalsModal({ user, onClose }) {
  const [dailyGoals, setDailyGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [progress, setProgress] = useState("");

  const fetchDailyGoals = useCallback(async () => {
    if (!user?.id) {
      console.error("User ID is not provided to DailyGoalsModal");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/daily-goals/${user.id}/`);
      if (response.ok) {
        const data = await response.json();
        setDailyGoals(data);
      } else {
        console.error("Failed to fetch daily goals");
      }
    } catch (error) {
      console.error("Error fetching daily goals:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDailyGoals();
  }, [fetchDailyGoals]);

  if (!user) {
    return null; // Ensure the component does not render if user is not defined
  }

  const handleAddGoal = async () => {
    if (!goalName || !progress) {
      alert("Goal name and progress are required.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/daily-goals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id, // Use user.id directly
          goal_name: goalName,
          progress: progress,
        }),
      });
  
      if (response.ok) {
        const newGoal = await response.json();
        setDailyGoals((prevGoals) => [...prevGoals, newGoal]);
        setGoalName("");
        setProgress("");
      } else {
        console.error("Failed to add goal");
      }
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  return (
    <div className="daily-goals-modal">
      <div className="daily-goals-modal-content">
        <span className="daily-goals-close" onClick={onClose}>
          &times;
        </span>
        <h2>Daily Goals</h2>
        <ul>
          {dailyGoals.map((goal) => (
            <li key={goal.id}>
              <span>
                {goal.goal_name} - {goal.progress}
              </span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Progress"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
        <button onClick={handleAddGoal}>Add Goal</button>
      </div>
    </div>
  );
}

export default DailyGoalsModal;