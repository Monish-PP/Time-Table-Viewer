import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<DashboardLayout />} />
        <Route path="/student" element={<DashboardLayout />} />
        <Route path="/faculty" element={<DashboardLayout />} />
        <Route path="/admin" element={<DashboardLayout />} />
        <Route path="*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
