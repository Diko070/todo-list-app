import React, { useState } from 'react';
import './AddTodo.css';

function AddTodo({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('ish');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({ text: text.trim(), category });
      setText('');
    }
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Yangi to-do qo'shish..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        <option value="ish">💼 Ish</option>
        <option value="shaxsi">👤 Shaxsi</option>
        <option value="oila">👨‍👩‍👧‍👦 Oila</option>
        <option value="boshqa">📌 Boshqa</option>
      </select>
      <button type="submit" className="btn-add">➕ Qo'shish</button>
    </form>
  );
}

export default AddTodo;
