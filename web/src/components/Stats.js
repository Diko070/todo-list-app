import React from 'react';
import './Stats.css';

function Stats({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-number">{total}</div>
        <div className="stat-label">Jami To-do</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{completed}</div>
        <div className="stat-label">✅ Bajarildi</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{pending}</div>
        <div className="stat-label">⏳ Bajarilmadi</div>
      </div>
      <div className="stat-card progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="stat-label">{percentage}% Bajarildi</div>
      </div>
    </div>
  );
}

export default Stats;
