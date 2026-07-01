import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, AsyncStorage, Switch } from 'react-native';

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
    const icons = { 'ish': '💼', 'shaxsi': '👤', 'oila': '👨‍👩‍👧‍👦', 'boshqa': '📌' };
    return icons[category] || '📌';
  };

  return (
    <View style={[styles.todoItem, todo.completed && styles.todoItemCompleted]}>
      <View style={styles.todoContent}>
        <TouchableOpacity onPress={() => onToggle(todo.id)}>
          <Text style={styles.checkbox}>{todo.completed ? '✅' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={styles.category}>{getCategoryIcon(todo.category)}</Text>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            autoFocus
          />
        ) : (
          <Text style={[styles.text, todo.completed && styles.completedText]}>{todo.text}</Text>
        )}
      </View>
      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.actionBtn}>💾</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.actionBtn}>❌</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.actionBtn}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(todo.id)}>
              <Text style={styles.actionBtn}>🗑️</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('ish');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos) setTodos(JSON.parse(savedTodos));
    } catch (err) {
      console.error(err);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = () => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        category,
        completed: false,
        createdAt: new Date().toLocaleDateString('uz-UZ'),
      };
      setTodos([newTodo, ...todos]);
      setText('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
  };

  const getFilteredTodos = () => {
    if (filter === 'completed') return todos.filter(t => t.completed);
    if (filter === 'pending') return todos.filter(t => !t.completed);
    return todos;
  };

  const filteredTodos = getFilteredTodos();
  const completed = todos.filter(t => t.completed).length;
  const percentage = todos.length === 0 ? 0 : Math.round((completed / todos.length) * 100);

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 To-Do List</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={[styles.stats, darkMode && styles.darkStats]}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todos.length}</Text>
          <Text style={styles.statLabel}>Jami</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completed}</Text>
          <Text style={styles.statLabel}>✅ Bajarildi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{percentage}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <View style={[styles.inputContainer, darkMode && styles.darkInput]}>
        <TextInput
          style={styles.input}
          placeholder="Yangi to-do qo'shish..."
          value={text}
          onChangeText={setText}
          placeholderTextColor={darkMode ? '#999' : '#ccc'}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addBtn}>
          <Text style={styles.addBtnText}>➕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterButtons}>
        {['all', 'pending', 'completed'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
              {f === 'all' ? '📋 Hamma' : f === 'pending' ? '⏳ Bajarilmadi' : '✅ Bajarildi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={todo => todo.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        )}
        style={styles.todoList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  darkContainer: {
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  darkStats: {
    backgroundColor: '#2a2a3e',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  darkInput: {
    backgroundColor: '#2a2a3e',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addBtnText: {
    color: 'white',
    fontSize: 18,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  filterBtnActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#666',
  },
  filterBtnTextActive: {
    color: 'white',
  },
  todoList: {
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  todoItemCompleted: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    fontSize: 18,
  },
  category: {
    fontSize: 16,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  editInput: {
    flex: 1,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 4,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    fontSize: 18,
    paddingHorizontal: 6,
  },
});
