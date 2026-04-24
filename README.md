# ⚡ FlowBase - Task Manager

FlowBase is a real-time task management application built to handle team-based workflows with live updates and structured access control.

## 🚀 Key Features

- Real-time task updates using Socket.IO (create, update, delete without reload)
- Role-based access:
  - Admin: manage users and assign tasks
  - User: manage assigned tasks
- Task status tracking (Todo, In-Progress, Completed)
- Responsive UI with dark/light mode
- JWT-based authentication and protected routes

## 💻 Tech Stack

- **Frontend:** Angular, Tailwind CSS, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time:** Socket.IO
- **Auth:** JWT, bcryptjs

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
