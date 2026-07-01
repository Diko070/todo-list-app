import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'ish': '💼',
      'shaxsi': '👤',
      'oila': '👨‍👩‍👧‍👦',
      'boshqa': '📌',
    };
    return icons[category] || '📌';
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="checkbox"
        />
        <span className="category">{getCategoryIcon(todo.category)}</span>
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
        ) : (
          <p className="text">{todo.text}</p>
        )}
        
        <span className="date">{todo.createdAt}</span>
      </div>

      <div className="actions">
        {isEditing ? (
          <>
            <button className="btn-save" onClick={handleSave}>💾</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>❌</button>
          </>
        ) : (
          <>
            <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️</button>
            <button className="btn-delete" onClick={() => onDelete(todo.id)}>🗑️</button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
