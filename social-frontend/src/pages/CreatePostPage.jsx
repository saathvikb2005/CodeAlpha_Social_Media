// frontend/src/pages/CreatePostPage.jsx
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePostPage.css'; // adjust path if needed


const CreatePostPage = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!image) {
      setError('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('access');
      const response = await axios.post('/posts/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created:', response.data);
      setSuccess('Post created successfully!');
      setCaption('');
      setImage(null);

      setTimeout(() => {
        navigate('/feed');
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      console.error('Upload error data:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to create post');
    }
  };

  return (
    <div className="create-post-page">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Post</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreatePostPage;
