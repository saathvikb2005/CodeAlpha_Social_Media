import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import CommentSection from '../components/CommentSection';
import '../styles/profile.css'; // ✅ add this line


const MyProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get(`profile/${username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [username]);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('access');
      const res = await axios.post(`posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(res.data.message);
      // Refresh posts after like/unlike
      const updated = await axios.get(`profile/${username}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(updated.data);
    } catch (err) {
      console.error('Failed to toggle like:', err.response?.data || err.message);
    }
  };

  return (
    <div className="my-profile-page">
      <h2>My Profile</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card" style={{ marginBottom: '40px' }}>
          <p><strong>@{username}</strong></p>
          <img src={post.image} alt="post" style={{ width: '100%', maxWidth: '400px' }} />
          <p>{post.caption}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>
          <br />
          <button onClick={() => handleLike(post.id)}>
            {post.liked_by_me ? '💔 Unlike' : '❤️ Like'}
          </button>
          <p>{post.like_count} Likes | {post.comment_count} Comments</p>

          <CommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default MyProfilePage;
