import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline, IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AddEditTask from "./pages/AddEditTask";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/task/:id?" element={user ? <AddEditTask /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
 

  return (
    <AuthProvider>
    
        <CssBaseline />
        <BrowserRouter>
         
          <AppRoutes />
        </BrowserRouter>
    
    </AuthProvider>
  );
}
