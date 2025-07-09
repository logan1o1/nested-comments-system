import React, { useEffect, useState } from 'react';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now  = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentTree({
  node,
  postComment,
  updateComment,
  deleteComment,
}) {
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [editing,  setEditing]  = useState(false)
  const [editText, setEditText] = useState(node.text)
  const [username, setUsername] = useState('Anonymous');

  useEffect(() => {
  if (!node.userid) return;

  (async () => {
    try {
      const res = await fetch(`http://localhost:3500/auth/find/${node.userid}`, {
        credentials: 'include'
      });
      // if (!res.ok) throw new Error();
      const data = await res.json();
      setUsername(data.username);
    } catch {
      setUsername('Anonymous');
    }
  })();
}, [node.userid]);

  const submitReply = () => {
    postComment(replyText, node.id)
    setReplyText('')
    setReplying(false)
  }

  const submitEdit = () => {
    updateComment(node.id, editText)
    setEditing(false)
  }

  return (
    <div className="comment">
      <div className="comment-votes">…</div>
      <div className="comment-body">
        <div className="comment-header">
          <strong>
            {node.userid ? username : 'Anonymous'}
          </strong> • {node.createdAt ? timeAgo(node.createdAt) : 'just now'}
        </div>

        {editing ? (
          <div className="new-comment" style={{ marginBottom: '0.5rem' }}>
            <textarea
              rows={2}
              value={editText}
              onChange={e => setEditText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button onClick={submitEdit}>Save</button>
              <button onClick={() => { setEditing(false); setEditText(node.text) }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="comment-text">{node.text}</div>
        )}

        {!editing && (
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setReplying(r => !r)}
              style={linkStyle}
            >
              Reply
            </button>
            <button
              onClick={() => setEditing(true)}
              style={linkStyle}
            >
              Edit
            </button>
            <button
              onClick={() => deleteComment(node.id)}
              style={linkStyle}
            >
              Delete
            </button>
          </div>
        )}

        {replying && (
          <div className="new-comment" style={{ marginTop: '0.5rem' }}>
            <textarea
              rows={2}
              placeholder="Write a reply…"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <button onClick={submitReply}>Post Reply</button>
          </div>
        )}

        {node.children?.length > 0 && (
          <div className="comment-children">
            {node.children.map(child => (
              <CommentTree
                key={child.id}
                node={child}
                postComment={postComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#4a90e2',
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.9rem',
}
