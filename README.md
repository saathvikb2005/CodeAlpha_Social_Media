# 🌐 Social Media App

A full-stack social media platform built with **Django REST Framework** and **React**. Users can register, log in, create posts with images, like/unlike posts, comment, follow other users, and explore user profiles. Includes a clean, responsive UI and full authentication system.

---

## 🔧 Features

- ✅ Register & Login with JWT Authentication  
- 🖼️ Create image-based posts  
- ❤️ Like & 💔 Unlike posts  
- 💬 Comment on posts  
- 🔄 Follow/Unfollow users  
- 👤 View your profile and others'  
- 🔐 Secure endpoints using DRF  
- 🎨 Responsive UI styled with modern CSS

---

## 🛠 Tech Stack

- **Frontend:** React, Axios, React Router  
- **Backend:** Django, Django REST Framework, Simple JWT  
- **Database:** SQLite (for development) / PostgreSQL (for production)  
- **Deployment:** Render (free full-stack hosting)

---

## ⚙️ Local Setup Instructions
### 1. Clone the Repository and Set Up

```bash
# Clone the repository
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app

# --- Backend Setup ---
cd backend
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# (Optional) Create a superuser for admin access
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver

# --- Frontend Setup (in a new terminal/tab) ---
cd frontend
npm install
npm start

