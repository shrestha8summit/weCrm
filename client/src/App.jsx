import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/login';
import Sign from './component/sign';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
      </Routes>
    </Router>
  );
}

export default App;
