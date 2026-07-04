# ⚡ FlowBase - Task Manager

A real-time full-stack task management application built with Angular, Node.js, Express, MongoDB, and Socket.IO featuring role-based access control and live task synchronization.

---

## ✨ Features

### Admin

- Manage users
- Assign tasks
- Monitor task progress
- Dashboard overview

### User

- View assigned tasks
- Update task status
- Real-time task synchronization

### General

- JWT Authentication
- Role-based access control
- Real-time updates using Socket.IO
- Dark & Light mode
- Responsive UI
- Secure REST API
- Form validation
- Error handling

---

## 🛠️ Tech Stack

### Frontend

- Angular
- TypeScript
- Tailwind CSS
- Chart.js

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Real-Time

- Socket.IO

### Authentication

- JWT
- bcryptjs

---

## 📂 Folder Structure

```text
FlowBase/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── frontend/
    └── src/
        ├── app/
        ├── assets/
        └── environments/
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/OmBaisane/FlowBase-Task-Manager.git
```

Navigate to the project

```bash
cd FlowBase-Task-Manager
```

Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend

```bash
npm run dev
```

Start the frontend

```bash
ng serve
```

---

## 📚 Key Learnings

- Angular application architecture
- Real-time communication with Socket.IO
- JWT Authentication
- Role-based authorization
- REST API development
- MongoDB & Mongoose integration
- Team-based workflow management

---

## 🔮 Future Improvements

- Notifications
- File attachments
- Activity logs
- Team workspaces
- Calendar integration
- Email notifications

---

## 📫 Contact

- 🌐 Portfolio: https://portfolio-nine-phi-ry8fa70ws1.vercel.app
- 💻 GitHub: https://github.com/OmBaisane
- 💼 LinkedIn: https://www.linkedin.com/in/om-baisane-b96625346
- 📧 Email: ombaisane29@gmail.com

---

## 📄 License

This project is licensed under the MIT License.
## 📂 Project Structure

FlowBase/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    └── src/
        ├── app/
        │   ├── components/
        │   ├── pages/
        │   ├── services/
        │   └── guards/
        └── index.html

## 🛠️ Installation & Setup

### Prerequisites
- Node.js
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB (Local or Atlas)

### 1. Clone the repository
git clone https://github.com/yourusername/FlowBase.git  
cd FlowBase

### 2. Backend Setup
(continue your steps...)

## 🧠 Key Learnings

- Implemented real-time updates using Socket.IO
- Worked with authentication and protected routes (JWT)
- Built role-based access logic
- Managed frontend-backend communication
- Structured a full-stack project

## ⭐ Note

This project showcases understanding of real-time systems, authentication, and full-stack architecture fundamentals.
