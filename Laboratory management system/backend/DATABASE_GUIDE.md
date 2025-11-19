# Database Connection Guide - Linos LMS

## Current Setup

Your Linos LMS project now has a **dedicated MongoDB instance** completely isolated from other projects.

### Connection Details

- **MongoDB Port:** 27018
- **Database Name:** linos_lms
- **Connection String:** `mongodb://localhost:27018/linos_lms`
- **Data Directory:** `./mongodb_data`

## How to Connect

### Option 1: MongoDB Compass (GUI)

1. Open **MongoDB Compass**
2. Use this connection string:
   ```
   mongodb://localhost:27018
   ```
3. Click "Connect"
4. You'll see the `linos_lms` database

### Option 2: MongoDB Shell (Terminal)

```bash
mongosh --port 27018
```

Then switch to the linos_lms database:
```javascript
use linos_lms
```

### Option 3: From Your Backend Code

The backend is already configured! It connects automatically using the `.env` file:
```
MONGO_URI=mongodb://localhost:27018/linos_lms
```

## Running the System

You need **TWO terminal windows**:

### Terminal 1: MongoDB Server
```bash
cd "/Users/tadiwachoga/Laboratory management system/backend"
npm run mongodb
```
**Keep this running!** This is your database server.

### Terminal 2: Backend API Server
```bash
cd "/Users/tadiwachoga/Laboratory management system/backend"
npm run dev
```
This starts your Express API on port 5000.

### Terminal 3 (Optional): Frontend
```bash
cd "/Users/tadiwachoga/Laboratory management system"
npm run dev
```

## Useful MongoDB Commands

Once connected via mongosh:

```javascript
// Switch to linos_lms database
use linos_lms

// Show all collections
show collections

// View all users
db.users.find()

// Count documents
db.users.countDocuments()

// Insert a test user
db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  isAdmin: false
})
```

## Verification

To verify everything is working:

1. **Check MongoDB is running:**
   ```bash
   mongosh --port 27018 --eval "db.adminCommand('ping')"
   ```
   Should return: `{ ok: 1 }`

2. **Check backend connection:**
   ```bash
   curl http://localhost:5000/
   ```
   Should return: `API is running...`

## Troubleshooting

**MongoDB won't start (exit code 48):**
- MongoDB is already running! This is good.
- Just proceed to start the backend server.

**Backend can't connect:**
- Make sure MongoDB is running on port 27018
- Check the `.env` file has the correct MONGO_URI

**Port already in use:**
- MongoDB: Change port in `mongod.conf`
- Backend: Change PORT in `.env`

## Important Notes

✅ This MongoDB instance is **completely separate** from Blue Ocean
✅ Data is stored locally in `./mongodb_data`
✅ The database is currently empty - it will populate as you use the API
✅ No authentication is enabled (development mode)
