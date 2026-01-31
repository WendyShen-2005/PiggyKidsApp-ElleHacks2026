import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './route/login.jsx';
import ParentDashboard from './route/parentsDashboard.jsx';
import KidsDashboard from './route/kidsDashboard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/kids-dashboard" element={<KidsDashboard />} />
    </Routes>
  );
}

export default App;
