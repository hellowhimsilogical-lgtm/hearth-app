import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { supabase } from '../supabase';
import { useAuth } from '../hooks/useAuth';

export default function Tasks() {
    const { user } = useAuth();
    const [newTitle, setNewTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tasks = useLiveQuery(
        () => db.tasks.orderBy('created_at').reverse().toArray(),
        []
    );

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !user) return;
        setSubmitting(true);
        try {
            const task = {
                title: newTitle.trim(),
                completed: false,
                family_id: user.user_metadata?.family_id,
                created_by: user.id,
                created_at: new Date().toISOString(),
            };
            await db.tasks.add(task);
            const { error } = await supabase.from('tasks').insert(task);
            if (error) throw error;
            setNewTitle('');
        } catch (err) {
            console.error('Failed to add task:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleTask = async (task) => {
        try {
            await db.tasks.update(task.id, { completed: !task.completed });
            const { error } = await supabase
                .from('tasks')
                .update({ completed: !task.completed })
                .eq('id', task.id);
            if (error) throw error;
        } catch (err) {
            console.error('Failed to toggle task:', err);
        }
    };

    return (
        <div className="tasks-page">
            <h2>Tasks</h2>
            <form onSubmit={addTask} className="add-task-form">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Add a new task..."
                    disabled={submitting}
                />
                <button type="submit" disabled={submitting || !newTitle.trim()}>
                    {submitting ? 'Adding...' : 'Add'}
                </button>
            </form>
            <ul className="task-list">
                {tasks?.map((task) => (
                    <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task)}
                        />
                        <span>{task.title}</span>
                    </li>
                ))}
            </ul>
            {!tasks?.length && <p>No tasks yet. Add one above!</p>}
        </div>
    );
}
