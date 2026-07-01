import React from 'react';
import './Filter.css';

function Filter({ currentFilter, onFilterChange, searchTerm, onSearchChange }) {
  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="🔍 Qidirish..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="filter-buttons">
        <button
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          📋 Hamma
        </button>
        <button
          className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          ⏳ Bajarilmadi
        </button>
        <button
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          ✅ Bajarildi
        </button>
      </div>
    </div>
  );
}

export default Filter;
