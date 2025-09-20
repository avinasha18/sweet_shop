# Sweet Shop Management System

A production-ready Sweet Shop Management System built with the MERN stack (MongoDB, Express, React, Node.js), featuring JWT authentication, role-based access control, and comprehensive inventory management.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### Sweet Management
- CRUD operations for sweets
- Advanced search and filtering
- Category-based organization
- Price range filtering
- Real-time inventory tracking

### Inventory Management
- Atomic purchase operations with MongoDB transactions
- Inventory logging for audit trails
- Stock management and restocking
- Out-of-stock prevention

### User Experience
- Modern, responsive UI with Tailwind CSS
- Smooth animations with Framer Motion
- Optimistic UI updates
- Real-time notifications with React Hot Toast
- Comprehensive error handling

### Development & Production
- Test-Driven Development (TDD) approach
- Comprehensive test suite (Unit, Integration, E2E)
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Structured logging with Winston
- Input validation with Joi
- Rate limiting and security middleware

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for input validation
- **Winston** for logging
- **Jest** with Supertest for testing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **express-rate-limit** for rate limiting

### Frontend
- **React 19** with Vite
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching and caching
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Axios** for HTTP requests

### DevOps & Testing
- **Docker** for containerization
- **Jest** for unit and integration testing
- **Vitest** for frontend testing
- **Testing Library** for React component testing
- **GitHub Actions** for CI/CD

## 📁 Project Structure

```
sweet-shop/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/               # API client and endpoints
│   │   ├── components/         # Reusable UI components
│   │   ├── context/           # React context providers
│   │   ├── pages/             # Page components
│   │   └── styles/            # Global styles
│   ├── Dockerfile
│   └── package.json
├── server/                     # Express backend
│   ├── config/                # Database configuration
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── scripts/              # Database scripts
│   ├── tests/                # Test files
│   ├── utils/                # Utility functions
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # Docker development setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Docker (optional)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd server
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Frontend environment
   cd ../client
   cp env.example .env
   # Edit .env with your API URL
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/healthz

### Docker Development Setup

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend Tests
```bash
cd client
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Sweets Endpoints

#### Get All Sweets
```http
GET /api/sweets?page=1&limit=10&category=Cakes&minPrice=10&maxPrice=50&q=chocolate
```

#### Get Sweet by ID
```http
GET /api/sweets/:id
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chocolate Cake",
  "category": "Cakes",
  "price": 25.99,
  "quantity": 10,
  "description": "Delicious chocolate cake with rich frosting",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Prevents brute force attacks
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

## 🚀 Deployment

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sweetshop
JWT_SECRET=your_very_secure_jwt_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

## My AI Usage

During this project I used AI tools to accelerate development and brainstorming. Details:

- **Tools used:**
  - ChatGPT (GPT-4) — used to generate API and component scaffolding, suggested tests, and to provide architecture guidance.
  - GitHub Copilot — used for code completion and boilerplate in repetitive sections.

- **How I used them:**
  - Generated initial Express + Mongoose boilerplate for routes and services, then reviewed and refactored code manually.
  - Asked the assistant to write Jest/Supertest test skeletons; I iterated on them and added edge-case assertions manually.
  - Created frontend component skeletons (React + Tailwind + Framer Motion); adjusted styling and animations by hand.

- **Reflection:**
  - AI helped reduce boilerplate time and produce a consistent folder structure. I validated and corrected all generated code, added business logic, and ensured security best practices (e.g., bcrypt usage, input validation).

### Example Commit Messages (with AI co-author trailers)

```
feat(auth): implement registration and login endpoints

Implemented registration endpoint with bcrypt hashing, login with JWT tokens, and refresh token support.
Added tests for registration and login flows.

Co-authored-by: ChatGPT <ai@users.noreply.github.com>
```

```
test(sweets): add purchase integration tests (red -> green)

Added tests to assert purchase reduces stock and prevents over-purchasing. Used mongodb-memory-server for isolation.

Co-authored-by: GitHub Copilot <copilot@users.noreply.github.com>
```
