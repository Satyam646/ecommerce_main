# 🛒 E-Commerce Platform (MERN Stack)

This is a full-featured E-Commerce web application built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It supports user authentication, product management, cart functionality, order processing, and admin controls.

## 📁 Project Structure

ecommerce_main/
├── ecomm_frontend/ # React frontend with user & admin views
└── ecomm_backend/ # Node.js backend with RESTful APIs

yaml
Copy
Edit

---

## 🚀 Features

### 👥 Authentication
- JWT-based login/signup
- Role-based access (User/Admin)

### 🛍️ User Panel
- Product browsing and filtering
- Cart and checkout flow
- Razorpay payment integration
- Order history

### ⚙️ Admin Panel
- Add/update/delete products
- View/manage orders and users
- Dashboard analytics

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Hooks, Context API)
- React Router
- MUI (Material-UI) for UI components

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Razorpay SDK
- JWT & Bcrypt for auth

---

---

## 🔧 Getting Started

### Backend Setup

```bash
cd ecomm_backend
npm install
npm start
Create a .env file with:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
Frontend Setup
bash
Copy
Edit
cd ecomm_frontend
npm install
npm start
🌐 Live Demo
https://ecommerce-main-1.onrender.com/


📦 Future Improvements
Product reviews & ratings

Pagination & sorting

Email notifications

PWA support

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

📬 Contact
Satyam Mishra
📧 satyam.myname0702@gmail.com
🔗 https://www.linkedin.com/in/satyam-mishra-aaa137176/
