# Development Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies  
cd ../client && npm install
```

### 2. Environment Setup
Create a `.env` file in the client directory:
```bash
# client/.env
VITE_API_URL=http://localhost:5000/api
```

Create a `.env` file in the server directory:
```bash
# server/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your_jwt_secret_key_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using MongoDB locally
mongod

# Or use MongoDB Atlas connection string in server/.env
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### 5. Seed Database (Optional)
```bash
cd server && npm run seed
```

### 6. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/healthz

## Sample Accounts (after seeding)
- **Admin**: admin@sweetshop.com / admin123
- **User**: john@sweetshop.com / user123

## Features Available
- ✅ User registration and login
- ✅ Sweet browsing with search and filters
- ✅ Sweet detail pages with purchase functionality
- ✅ Admin dashboard for inventory management
- ✅ Responsive design with dark mode support
- ✅ Real-time notifications
- ✅ Optimistic UI updates

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running on port 5000
2. **API Connection Issues**: Check that VITE_API_URL is set correctly
3. **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
4. **Port Conflicts**: Make sure ports 5000 and 5173 are available

### Development Tips

- Use the browser dev tools to check network requests
- Check the backend console for any error messages
- Use the React Query DevTools (if installed) to debug API calls
- Check the MongoDB connection in the backend logs
