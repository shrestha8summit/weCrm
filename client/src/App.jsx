import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/login.jsx';
import Sign from './component/sign.jsx';
import Dashboard from './component/dashboard.jsx';
import UserProfile from './component/userProfile.jsx';
import Register from './component/register.jsx';
import './App.css';
import ProtectedRoute from './component/protectedRoute.js';
import ForgetPassword from './component/forgetPassword.jsx';
import OTPPage from './component/Otp.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("token"); // Remove the JWT token if stored
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={ isLoggedIn ? (
              userType === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/userProfile" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        {!isLoggedIn && ( 
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Sign />} />
            <Route path="/forgetPassword" element={ <ForgetPassword/>} />
            <Route path="/otp" element={ <OTPPage/>} />
          </>
        )}

        {/* Protected routes */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/sign" element={userType === "admin" ? <Sign /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={userType === "admin" ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/userProfile" element={<UserProfile onLogout={handleLogout} />} />
          
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
