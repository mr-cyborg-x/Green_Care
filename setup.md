# 🌿 GreenCare - AI-Powered Plant Care Assistant

GreenCare is a comprehensive full-stack web application designed to help plant enthusiasts take better care of their green friends. It combines community features with AI-powered disease detection and personalized care reminders.

## 🚀 Technology Stack

This project is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) to ensure scalability, performance, and a seamless user experience.

### Frontend (Client)
*   **React 19**: A powerful JavaScript library for building user interfaces. We use it for its component-based architecture and efficient state management.
*   **Vite**: A next-generation build tool that provides a lightning-fast development server and optimized production builds.
*   **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development with a modern, responsive design system.
*   **Framer Motion**: A production-ready motion library for React, used to create smooth animations and interactive elements (like the like button confetti and page transitions).
*   **Axios**: A promise-based HTTP client for making API requests to the backend.
*   **Lucide React**: A collection of beautiful, consistent SVG icons.

### Backend (Server)
*   **Node.js**: A JavaScript runtime built on Chrome's V8 engine, allowing us to run JavaScript on the server.
*   **Express.js**: A minimal and flexible Node.js web application framework used to build robust APIs.
*   **MongoDB**: A NoSQL database used to store user data, posts, and reminders flexibly and efficiently.
*   **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a schema-based solution to model application data.
*   **JWT (JSON Web Tokens)**: Used for secure user authentication and authorization.
*   **Bcrypt.js**: A library to help hash passwords, ensuring user credentials are stored securely.

---

## ✨ Key Features

1.  **Community Feed**: Share photos of your plants, like, comment, and save posts from other users.
2.  **AI Disease Detection**: Upload a photo of a sick plant leaf to instantly identify diseases and get treatment recommendations (Home & Chemical remedies).
3.  **Daily Care Reminders**: Set personalized reminders for watering, fertilizing, and repotting your plants.
4.  **Profile Management**: Manage your posts, view saved items, and track your plant care history.

---

## 🛠️ How to Run Locally

Follow these steps to get the project up and running on your machine.

### Prerequisites
*   **Node.js** (v14 or higher) installed.
*   **MongoDB** installed locally or a MongoDB Atlas connection string.

### 1. Clone the Repository
```bash
git clone https://github.com/mr-cyborg-x/Green_Care.git
cd Green_Care
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

Start the backend server:
```bash
node index.js
```
*The server will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```
*The application will open at `http://localhost:5173`*

---

## 📱 Usage
1.  Open your browser and go to `http://localhost:5173`.
2.  **Sign Up** for a new account or **Login** (Admin credentials: `admin123@gmail.com` / `admin123`).
3.  Explore the **Feed**, try the **Disease Detector**, or set a **Reminder**!

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
