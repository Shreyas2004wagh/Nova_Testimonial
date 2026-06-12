# Nova Testimonial

Nova Testimonial is a MERN application for collecting customer testimonials. Users can sign up, create public feedback spaces, share a generated link, and review submitted feedback from their dashboard.

## What It Does

- Creates user accounts and logs users in with JWT-based authentication.
- Lets a user create testimonial spaces with a public URL, header text, custom message, questions, optional star-rating setting, and an optional image.
- Generates a shareable public testimonial link for each space.
- Collects text feedback from public visitors and stores answers against the configured questions.
- Shows per-space feedback details and dashboard-level text/video feedback counts.
- Supports Cloudinary image/video upload endpoints.
- Supports password reset by email OTP through Nodemailer.
- Stores users, spaces, feedback, and generated links in MongoDB.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, React Icons
- Backend: Node.js, Express, Mongoose, Multer, Cloudinary, Nodemailer
- Database: MongoDB
- Auth: JSON Web Tokens, bcrypt password hashing

## Project Structure

```text
Nova_Testimonial/
  Client/                 React + Vite frontend
    src/Pages/            Main route pages
    src/config/api.js     Frontend API base URL helper
  Server/                 Express API
    models/               Mongoose models
    utils/                Cloudinary and Multer helpers
    routes.js             API routes
    server.js             API entry point
```

## Prerequisites

- Node.js and npm
- MongoDB, either local or hosted through MongoDB Atlas
- Cloudinary account, required only if you use image/video upload features
- Gmail app password or another Gmail-compatible app password, required only for password reset OTP email

## Environment Variables

Copy the example files and fill in your values:

```powershell
Copy-Item Server\.env.example Server\.env
Copy-Item Client\.env.example Client\.env
```

Server variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nova_testimonial
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-api-secret

EMAIL_SERVICE=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

Client variables:

```env
VITE_API_BASE_URL=http://localhost:5000
```

`CLIENT_URL` is used by the server when it returns newly generated testimonial links. `VITE_API_BASE_URL` is used by the frontend when calling the API.

## Setup

Install backend dependencies:

```powershell
cd Server
npm install
```

Install frontend dependencies:

```powershell
cd ..\Client
npm install
```

Start the backend:

```powershell
cd ..\Server
npm run dev
```

The API runs at `http://localhost:5000` by default.

Start the frontend in another terminal:

```powershell
cd Client
npm run dev
```

Vite runs at `http://localhost:5173` by default. Open that URL in your browser.

## Available Scripts

Backend:

```powershell
cd Server
npm run dev     # start API with nodemon
npm start       # start API with node
npm test        # syntax-check server files
```

Frontend:

```powershell
cd Client
npm run dev     # start Vite dev server
npm run build   # create production build
npm run lint    # run ESLint
npm run preview # preview production build
```

## Core API Routes

- `POST /SignUp` - create a user account.
- `POST /login` - log in and receive a token plus user ID.
- `POST /addSpace` - create a testimonial space, optionally with an image file.
- `GET /getSpacesByUserId/:userId` - list spaces owned by a user.
- `GET /space/:publicUrl` - fetch public space details.
- `POST /space/:publicUrl/feedback` - submit text feedback for a space.
- `GET /space/:publicUrl/feedbackDetails` - fetch submitted feedback for a space.
- `GET /space/:publicUrl/feedbackCounts` - fetch text/video feedback counts.
- `POST /upload` - upload an image to Cloudinary.
- `POST /uploadVideo` - upload an MP4 video to Cloudinary.
- `POST /forget-password` - send OTP for password reset.
- `PUT /reset-password` - reset password with OTP.

## Notes and Troubleshooting

- If sign up or login fails with a server error, verify `JWT_SECRET` is set in `Server/.env`.
- If spaces do not load, verify MongoDB is running and `MONGO_URI` is correct.
- If generated links point to the wrong frontend URL, update `CLIENT_URL` in `Server/.env`.
- If frontend requests go to the wrong API URL, update `VITE_API_BASE_URL` in `Client/.env` and restart Vite.
- If uploads fail, verify all Cloudinary variables are set.
- If password reset email fails, use a Gmail app password rather than your normal Gmail password.
- Uploaded files are staged in the system temp directory before Cloudinary upload. The app accepts GIF, JPEG, PNG, and MP4 files up to 5 MB.

## Verification

Current checks used for this repo:

```powershell
cd Server
npm test

cd ..\Client
npm run lint
npm run build
```
