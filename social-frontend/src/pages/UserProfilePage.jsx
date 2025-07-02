import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

const UserProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [followed, setFollowed] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const currentUser = localStorage.getItem('username');
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter(user => user.username !== currentUser));
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await axios.get(`/profile/${currentUser}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const followingUsernames = res.data.following.map(f => f.username);
        const followMap = {};
        followingUsernames.forEach(username => {
          followMap[username] = true;
        });
        setFollowed(followMap);
      } catch (err) {
        console.error('Failed to fetch following:', err);
      }
    };

    fetchUsers();
    fetchFollowing();
  }, [currentUser, token]);

  const handleToggleFollow = async (username) => {
    try {
      await axios.post(`/follow/${username}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowed(prev => ({
        ...prev,
        [username]: !prev[username],
      }));
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  const handleViewProfile = async (username) => {
    setSelectedUser(username);
    try {
      const res = await axios.get(`/profile/${username}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPosts(res.data);
    } catch (err) {
      console.error('Failed to load user posts:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Users</h2>
      {users.map(user => (
        <div key={user.username} style={styles.userCard}>
          <span
            style={styles.username}
            onClick={() => handleViewProfile(user.username)}
          >
            @{user.username}
          </span>
          <button
            onClick={() => handleToggleFollow(user.username)}
            style={styles.followBtn}
          >
            {followed[user.username] ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      ))}

      {selectedUser && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={styles.heading}>Posts by @{selectedUser}</h3>
          {userPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <img
                  src={post.image}
                  alt="post"
                  style={styles.postImage}
                />
                <p>{post.caption}</p>
                <small style={styles.timestamp}>
                  {new Date(post.created_at).toLocaleString()}
                </small>
                <p>{post.like_count} Likes | {post.comment_count} Comments</p>
                <CommentSection postId={post.id} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  userCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    padding: '10px 0',
    flexWrap: 'wrap',
    gap: '6px',
  },
  username: {
    color: '#007bff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  followBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  postCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '25px',
    backgroundColor: '#fafafa',
  },
  postImage: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '6px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  timestamp: {
    color: '#777',
  },
};

export default UserProfilePage;
