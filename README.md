Doctor Appointment Booking System - MERN Stack

📌 Project Overview

The Doctor Appointment Booking System is a full-stack web application designed to streamline the process of booking medical appointments. It enables patients to book appointments with doctors, while doctors and admins can manage schedules and profiles. The system provides three levels of authentication: Patients, Doctors, and Admins. Additionally, it integrates an online payment gateway to facilitate secure transactions.

🚀 Features

🔹 Patient Features

Register/Login using JWT authentication

Browse available doctors based on specialty

Book, reschedule, or cancel appointments

View appointment history

Make online payments for consultations

Update profile details

🔹 Doctor Features

Register/Login using JWT authentication

Set availability schedule

Manage appointments (accept/reject requests)

View appointment history

Update profile information

Upload and manage documents using Multer

🔹 Admin Features

Manage patients and doctors

Approve or reject doctor registrations

Monitor appointments and transactions

Access dashboard analytics

🛠️ Tech Stack

Frontend:

React.js

Redux

Tailwind CSS

React Router

Backend:

Node.js

Express.js

MongoDB

JWT Authentication

Multer (for file uploads)

Other Integrations:

Payment Gateway (Stripe/Razorpay)

Nodemailer (Email notifications)

🏗️ Installation & Setup

1. Clone the Repository

git clone https://github.com/yourusername/doctor-appointment-booking.git
cd doctor-appointment-booking

2. Install Dependencies

Frontend

cd client
npm install

Backend

cd server
npm install

3. Setup Environment Variables

Create a .env file in the server directory and configure the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
STRIPE_SECRET_KEY=your_payment_gateway_key

4. Run the Application

Backend

cd server
npm start

Frontend

cd client
npm start

📂 Folder Structure

📁 doctor-appointment-booking
 ├── 📁 client (Frontend - React.js)
 ├── 📁 server (Backend - Node.js & Express)
 ├── 📁 models (MongoDB Schemas)
 ├── 📁 routes (API Routes)
 ├── 📁 controllers (Business Logic)
 ├── 📁 middleware (Auth Middleware)
 ├── 📁 config (Database Connection & Keys)

📸 Screenshots

(Add relevant screenshots of the application interface here)

🎯 Future Enhancements

Implement video consultations

Add AI-based doctor recommendations

Multi-language support

🤝 Contributing

Contributions are welcome! Feel free to raise issues or submit pull requests.

📜 License

This project is licensed under the MIT License.

✨ Developed by ~ Amit Gupta

