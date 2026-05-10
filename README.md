# 🎟️ Event Registration App — MERN Stack

A simple full-stack event registration application built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
EVENT REGISTRATION/
├── backend/
│   ├── models/
│   │   └── Registration.js       # Mongoose schema
│   ├── routes/
│   │   └── registrations.js      # API routes
│   ├── .env                      # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Express entry point
└── frontend/
    ├── src/
    │   ├── App.js                # Main React component
    │   └── App.css               # Styles
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Setup Instructions

### 1. Configure MongoDB Atlas

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. Create a database user and whitelist your IP address (or use `0.0.0.0/0` for all).
3. Copy your connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventregistration?retryWrites=true&w=majority
   ```

### 2. Configure Backend Environment Variables

Open `backend/.env` and replace the placeholder with your real connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventregistration?retryWrites=true&w=majority
PORT=5000
```

### 3. Run the Backend

```bash
cd backend
npm install        # already done if you followed setup
npm run dev        # uses nodemon for auto-restart
# OR
npm start          # plain node
```

The backend starts at **http://localhost:5000**

### 4. Run the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install        # already done if you followed setup
npm start
```

The React app opens at **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /registrations      | Get all registrations    |
| POST   | /registrations      | Create a registration    |
| DELETE | /registrations/:id  | Delete a registration    |

---

## ✅ Validation Rules

| Field | Rule                              |
|-------|-----------------------------------|
| Name  | Required, min 2 characters        |
| Email | Required, valid email format      |
| Phone | Required, exactly 10 digits       |

Validation is enforced on **both** the frontend (instant feedback) and backend (Mongoose schema).

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (via Mongoose)
- **Environment**: dotenv, CORS
