# 🌿 GreenCare - Plant Care Social Platform

A full-stack web application for plant enthusiasts to share their plant journey, manage care schedules, and detect plant diseases.

## Features

- 📱 **Social Feed**: Share plant photos and interact with other plant lovers
- 🪴 **Daily Care Reminders**: Never forget to water, fertilize, or prune your plants
- 🔍 **Disease Detection**: AI-powered plant disease identification (mock implementation)
- 👤 **User Profiles**: Track your posts and reminders
- 🔐 **Secure Authentication**: JWT-based login system

## Tech Stack

### Frontend
- React 19 with Vite
- React Router DOM for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd solar-armstrong
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/greencare
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the backend server**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

3. **Start the frontend development server**
```bash
cd client
npm run dev
```
Frontend will run on http://localhost:5173 (or similar)

4. **Open your browser** and navigate to the frontend URL

## Usage

1. **Login/Signup**: Enter your email or mobile number to create an account or login
2. **Feed**: Browse posts, like, save, and create your own plant posts
3. **Daily Care**: Add reminders for watering, fertilizing, and other plant care tasks
4. **Detect**: Upload a photo of a plant leaf to detect diseases (mock AI)
5. **Profile**: View your posts and reminders, manage your account

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login or auto-signup
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/save` - Save/unsave post
- `GET /api/posts/user/:username` - Get user's posts

### Reminders
- `GET /api/reminders` - Get user's reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### Disease Detection
- `POST /api/detect` - Detect plant disease

## Project Structure

```
solar-armstrong/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
│
└── server/                # Express backend
    ├── middleware/        # Custom middleware
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    ├── index.js          # Server entry point
    └── package.json
```

## Future Enhancements

- Real AI-powered disease detection
- Cloud image storage (AWS S3, Cloudinary)
- Real-time notifications
- Comment system for posts
- User follow system
- Dark mode
- Progressive Web App (PWA)
- Email verification
- Password reset functionality

## License

MIT

## Author

Built with ❤️ for plant lovers everywhere
