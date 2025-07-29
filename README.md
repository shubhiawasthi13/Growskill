📚 Learning Management System (LMS)
A full-featured Learning Management System built with the MERN stack and a companion mobile app developed using React Native. The platform offers secure user authentication, video lectures, course progress tracking, and Stripe payment integration—delivering a seamless learning experience across both web and mobile.

🚀 Features
👨‍🏫 Instructor & Student Authentication

🎥 Video Lecture Upload & Management

💳 Course Purchase with Stripe

📊 Student Course Progress Tracking

📁 Dashboard for Managing Courses

🔐 Secure Login with JWT & Cookies

📱 React Native Mobile App: Learn on the go with a fully responsive mobile app. Students can view enrolled courses, watch video lectures, track progress, and download completion certificates directly from the app.

🧠 AI-Powered Interview Questions: Automatically generate course-related interview questions using the mistral-7b-instruct model via OpenRouter API.

📄 Certificate Generation: Students can download a personalized course completion certificate including their name, course title, and completion date.

🧠 AI Integration Details
The LMS uses the OpenRouter API to generate intelligent, course-specific interview questions.
Model Used: mistralai/mistral-7b-instruct:free
This enables smart question generation tailored to each course, helping students prepare better for interviews.

🔐 Admin Panel Login
Use the following credentials to access the admin panel:

Email: shubhi@gmail.com

Password: password1234

💳 Stripe Test Payment Details
This project uses Stripe in test mode. Use the following card details to simulate payments:

Card Number: 4242 4242 4242 4242

Expiry Date: Any future date (e.g., 12/30)

CVC: 123

🛠 Tech Stack
Frontend: React.js, Tailwind CSS

Mobile App: React Native (Expo)

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT & Cookie-based

Payments: Stripe Integration

AI: OpenRouter API (Mistral 7B) for dynamic interview questions

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
