import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import Graph3D from "./Components/Dashboard/Graph3D";
import Graph2D from "./Components/Dashboard/Graph2D";

// import "bootstrap/dist/css/bootstrap.min.css";

// Function to check if the user is logged in
const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
};

// Function to render routes based on login status
const renderRoutes = () => {
  if (isLoggedIn()) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/graph3d" element={<Graph3D />} />
        <Route path="/graph2d" element={<Graph2D />} />
        <Route path="/login" element={<Navigate replace to="/dashboard" />} />
        <Route path="/register" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>{renderRoutes()}</BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);