# Food Delivery App

A full-stack food delivery application built with React frontend and Node.js backend.

## Features

- User authentication and registration
- Browse restaurants and menus
- Add items to cart and place orders
- Admin panel for restaurant and menu management
- Responsive design

## Tech Stack

**Frontend:**
- React.js
- CSS3
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcryptjs for password hashing

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
```

4. Populate sample data:
```bash
node sampleData.js
```

5. Start backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```

## Default Credentials

**Admin:**
- Email: admin@gmail.com
- Password: admin123

**User:**
- Email: user@example.com
- Password: user123

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/restaurants` - Get all restaurants
- `GET /api/menu/:restaurantId` - Get restaurant menu
- `POST /api/orders` - Place order

## Restaurants

- McDonald's - Fast food burgers and sides
- Irani Cafe - Traditional Iranian cuisine
- Subway - Fresh sandwiches and salads

## Running the App

1. Start backend server (port 3001)
2. Start frontend (port 3000)
3. Access app at http://localhost:3000