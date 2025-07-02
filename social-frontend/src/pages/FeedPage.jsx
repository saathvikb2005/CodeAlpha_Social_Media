import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import CommentSection from '../components/CommentSection';
import '../styles/FeedPage.css'; // Adjust path if needed


const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('posts/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err.response?.data || err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('access');
      const res = await axios.post(`posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(res.data.message); // 'Liked' or 'Unliked'
      fetchPosts(); // Refresh posts after like/unlike
    } catch (err) {
      console.error('Failed to toggle like:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <h2>Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card" style={{ marginBottom: '40px' }}>
          <p><strong>@{post.user}</strong></p>
          <img src={post.image} alt="post" style={{ width: '100%', maxWidth: '400px' }} />
          <p>{post.caption}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>

          {/* 🔽 Post metadata */}
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <span>{post.like_count} ❤️</span> | <span>{post.comment_count} 💬</span>
          </div>

          {/* 🔘 Like Button */}
          <button onClick={() => handleLike(post.id)}>
            {post.liked_by_me ? '💔 Unlike' : '❤️ Like'}
          </button>

          {/* 🔽 Comment Section */}
          <CommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default FeedPage;
