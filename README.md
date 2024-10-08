# Nova_Testimonial

Welcome to **Nova_Testimonial**! This project is an innovative platform that allows users to collect, manage, and display video testimonials using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: Secure signup and login functionality using JWT (JSON Web Tokens).
- **Video Uploads**: Users can easily upload and manage video testimonials.
- **Dashboard**: A comprehensive dashboard to view, manage, and organize all testimonials.
- **User Profiles**: Personalized profiles for users to manage their submitted testimonials.
- **Responsive Design**: The platform is fully responsive, ensuring a smooth experience on both desktop and mobile devices.

## Tech Stack

- **Frontend**: React, Redux, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

Follow these steps to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nova_testimonial.git
cd nova_testimonial
```

### 2. Install Dependencies

Navigate to both the `client` and `server` directories to install the necessary dependencies.

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd ../server
npm install
```

### 3. Environment Variables

In the `server` directory, create a `.env` file and add your environment variables for MongoDB connection and JWT secret.

Example `.env` file:

```bash
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000
```

### 4. Run the Application

Now you can start both the client and server.

#### Running the Client

```bash
cd client
npm run dev
```

This will start the React frontend on [http://localhost:3000](http://localhost:3000).

#### Running the Server

```bash
cd ../server
npm start
```

This will start the Node.js backend on [http://localhost:5000](http://localhost:5000).

### 5. Access the Application

Once both the client and server are running, open your browser and go to:

```bash
http://localhost:3000
```

You will now be able to access the **Nova_Testimonial** platform and begin using the features.

---

### Contributing

Feel free to fork the project and submit pull requests for improvements or bug fixes!

---

### License

This project is licensed under the MIT License.

---

Feel free to customize or extend the setup instructions based on your specific environment.
