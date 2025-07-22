📚 Learning Management System (LMS)
A full-featured Learning Management System built with the MERN stack. This platform allows instructors to create and manage courses, and enables students to enroll, access video lectures, and track their learning progress. It also integrates Stripe for secure course purchases.

🚀 Features
👨‍🏫 Instructor & Student Authentication

🎥 Video Lecture Upload & Management

✅ Course Purchase with Stripe

📊 Student Course Progress Tracking

📁 Dashboard for Managing Courses

🔐 Secure Login with JWT & Cookies

🧠 AI-Powered Interview Questions: Automatically generate course-related interview questions using the mistral-7b-instruct model via OpenRouter API.

📄 Certificate Generation: Students can download a personalized course completion certificate that includes their name, course title, and completion date after finishing a course.

🧠 AI Integration Details
The LMS uses the OpenRouter API to generate intelligent, course-specific interview questions. It leverages:

API Endpoint: https://openrouter.ai/api/v1/chat/completions

Model Used: mistralai/mistral-7b-instruct:free

This enables smart question generation tailored to each course, helping students prepare better for interviews.



🔐 Admin Panel Login
Use the following credentials to access the admin panel:

Email: shubhi@gmail.com
Password: password1234

💳 Stripe Test Payment Details
This project uses Stripe in test mode. Use the following card details to simulate payments:

Card Number: 4242 4242 4242 4242

Expiry Date: Any future date (e.g. 12/30)

CVC: 123

🛠 Tech Stack
Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT & Cookie-based

Payments: Stripe Integration

AI: OpenRouter API for dynamic interview questions

PDF Generation: Certificate creation using pdf-lib

⚙️ Env Setup
DATABASE_URI=
PORT=
SECRET_KEY=
CLOUD_NAME=
API_KEY=
API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISH_KEY=
FRONTEND_URL=
WEBHOOK_ENDPOINT_SECRET=
OR_API_KEY=
