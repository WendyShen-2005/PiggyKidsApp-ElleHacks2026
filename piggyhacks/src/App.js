import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './route/login.jsx';
import ParentDashboard from './route/parentsDashboard.jsx';
import KidsDashboard from './route/kidsDashboard.jsx';
import TasksPage from './route/kidsTaskPage.jsx';
import FarmersMarket from './route/FarmersMarket.jsx';
import FruitDetail from './route/FruitDetail.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/kids-dashboard" element={<KidsDashboard />} />
      <Route path="/kids-tasks" element={<TasksPage />} />
      <Route path="/stock-farm" element={<FarmersMarket />} />
      <Route path="/fruit-detail" element={<FruitDetail />} />
    </Routes>
  );
}

export default App;
