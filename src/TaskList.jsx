import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { isValidTaskTitle } from './utils'

export default function TaskList({ session }) {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    setTasks(data || [])
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!isValidTaskTitle(newTitle)) return
    await supabase.from('tasks').insert({
      title: newTitle,
      user_id: session.user.id,
    })
    setNewTitle('')
    fetchTasks()
  }

  const toggleDone = async (task) => {
    await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id)
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  return (
    <div>
      <form onSubmit={addTask}>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nueva tarea" />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}
              onClick={() => toggleDone(task)}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}