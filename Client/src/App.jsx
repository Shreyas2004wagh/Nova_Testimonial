import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import SpaceForm from './Pages/SpaceForm';
import Dashboard from './Pages/Dashboard';
import SpacePage from './Pages/SpacePage';
import SpaceDetails from './Pages/SpaceDetails';
import Profile from './Pages/Profile';
import LandingPage from './Pages/LandingPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-space" element={<SpaceForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:publicUrl" element={<SpacePage />} />
        <Route path="/space-details" element={<SpaceDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
