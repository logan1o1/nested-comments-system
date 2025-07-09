import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; 

export default function Notifications() {
  const [notes, setNotes]     = useState([]);   
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true);

    const res = await fetch('http://localhost:3500/notification/get-notif', {
      credentials: 'include',
    });
    if (res.status === 401) {
      navigate('/signin');
      return;
    }

    const data = await res.json();
    console.debug('raw notifications payload:', data);

    let arr;
    if (Array.isArray(data)) {
      arr = data;
    } else if (Array.isArray(data.notifications)) {
      arr = data.notifications;
    } else if (Array.isArray(data.payload)) {
      arr = data.payload;
    } else {
      const firstKey = Object.keys(data)[0];
      arr = Array.isArray(data[firstKey]) ? data[firstKey] : [];
    }

    setNotes(arr);
    setLoading(false);
  };

  const toggleRead = async (id, currentRead) => {
    // optimistic UI
    setNotes(ns =>
      ns.map(n => (n.id === id ? { ...n, read: !currentRead } : n))
    );

    await fetch(`http://localhost:3500/notification/read/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ read: !currentRead }),
    });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return <div className="notifications-container">Loading…</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notes.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="notification-list">
          {notes.map(n => (
            <li
              key={n.id}
              className={`notification-item ${n.read ? 'read' : 'unread'}`}
            >
              <span className="notification-text">
                Reply on comment{' '}
                <strong>
                  {n.comment && n.comment.id
                    ? n.comment.id.slice(0, 5)
                    : '—'}
                </strong>{' '}
                • {new Date(n.createdAt).toLocaleString()}
              </span>
              <button
                className="mark-btn"
                onClick={() => toggleRead(n.id, n.read)}
              >
                Mark {n.read ? 'Unread' : 'Read'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
