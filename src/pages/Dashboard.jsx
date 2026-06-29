import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const { syncing, lastSynced } = useSync();

    const tasks = useLiveQuery(
        () => db.tasks.orderBy('created_at').reverse().limit(5).toArray(),
        []
    );

    const events = useLiveQuery(
        () => db.events.orderBy('starts_at').toArray(),
        []
    );

    return (
        <div className="dashboard">
            <header className="app-header">
                <h1>Hearth</h1>
                <div className="header-actions">
                    <span className={`sync-status ${syncing ? 'syncing' : ''}`}>
                        {syncing ? 'Syncing...' : lastSynced ? `Synced ${lastSynced.toLocaleTimeString()}` : 'Not synced'}
                    </span>
                    <button onClick={signOut} className="sign-out-btn">Sign Out</button>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="welcome">
                    <h2>Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h2>
                </section>

                <section className="tasks-preview">
                    <h3>Recent Tasks</h3>
                    {tasks?.length ? (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id} className={task.completed ? 'completed' : ''}>
                                    {task.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tasks yet. Add your first task!</p>
                    )}
                </section>

                <section className="events-preview">
                    <h3>Upcoming Events</h3>
                    {events?.length ? (
                        <ul>
                            {events.map((event) => (
                                <li key={event.id}>
                                    <strong>{event.title}</strong>
                                    <span>{new Date(event.starts_at).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No upcoming events.</p>
                    )}
                </section>
            </main>
        </div>
    );
}
