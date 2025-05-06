import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/login.jsx'; // Ensure this path is correct
import Sign from './component/sign.jsx'; // Ensure this path is correct
import Dashboard from './component/dashboard.jsx'; // Ensure this path is correct
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
