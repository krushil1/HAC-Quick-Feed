import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // Check if the user is authenticated by verifying the value in local storage
  let isLoggedIn = localStorage.getItem('isLoggedIn');
  
  // If 'isLoggedIn' is not found in local storage, add it and set it to false
  if (isLoggedIn === null) {
    localStorage.setItem('isLoggedIn', 'false');
    isLoggedIn = 'false';
  }

  return isLoggedIn === 'true';
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, allow access to the protected content
  return children;
};

export default ProtectedRoute;
