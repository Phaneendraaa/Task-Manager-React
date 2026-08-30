import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  const addTask = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    }
    setTasks([newTask, ...tasks])
    setInput('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed))
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const remaining = tasks.filter(t => !t.completed).length

  return (
    <div className="app">
      <div className="card">
        <h1>Task Manager</h1>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">Add</button>
        </form>

        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 && (
            <li className="empty">No tasks here</li>
          )}
          {filteredTasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
              </label>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="footer">
          <span>{remaining} task{remaining !== 1 ? 's' : ''} left</span>
          <button onClick={clearCompleted}>Clear completed</button>
        </div>
      </div>
    </div>
  )
}

export default App
