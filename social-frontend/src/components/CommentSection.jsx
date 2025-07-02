import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`comments/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
    } catch (err) {
      setError('Failed to load comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem('access');
      await axios.post(
        'comments/create/',
        { text, post: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      fetchComments(); // Refresh after posting
    } catch (err) {
      setError('Failed to post comment');
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>Comments</h4>

      {comments.length === 0 ? (
        <p style={styles.noComments}>No comments yet</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} style={styles.comment}>
            <strong style={styles.username}>{c.user}:</strong> {c.text}
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Post</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  heading: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#444',
  },
  noComments: {
    color: '#888',
    fontStyle: 'italic',
  },
  comment: {
    marginBottom: '8px',
    fontSize: '0.95rem',
    color: '#333',
  },
  username: {
    color: '#111',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '12px',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '0.95rem',
  },
  button: {
    padding: '8px 14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default CommentSection;
