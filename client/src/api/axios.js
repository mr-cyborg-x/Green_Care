import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data),
};

// Posts API
export const postsAPI = {
    getAll: () => api.get('/posts'),
    create: (postData) => api.post('/posts', postData),
    like: (postId) => api.post(`/posts/${postId}/like`),
    save: (postId) => api.post(`/posts/${postId}/save`),
    getSaved: () => api.get('/posts/saved'),
    addComment: (id, text) => api.post(`/posts/${id}/comment`, { text }),
    getUserPosts: (username) => api.get(`/posts/user/${username}`),
    search: (query) => api.get(`/posts/search?q=${query}`),
};

// Reminders API
export const remindersAPI = {
    getAll: () => api.get('/reminders'),
    create: (reminderData) => api.post('/reminders', reminderData),
    update: (id, reminderData) => api.put(`/reminders/${id}`, reminderData),
    delete: (id) => api.delete(`/reminders/${id}`),
};

// Disease Detection API
export const detectAPI = {
    detect: (imageData) => api.post('/detect', { image: imageData }),
};

export default api;
