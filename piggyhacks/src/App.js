import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './route/login.jsx';
import ParentDashboard from './route/parentsDashboard.jsx';
import KidsDashboard from './route/kidsDashboard.jsx';
import KidsTasksPage from './route/kidsTaskPage.jsx';
import FarmersMarket from './route/FarmersMarket.jsx';
import FruitDetail from './route/FruitDetail.jsx';
import ParentTaskPage from './route/parentTaskPage.jsx';
import KidMonthlyStatement from './route/KidMonthlyExpenses.jsx';
import ParentMonthlyStatement from './route/parentMonthlyStatement.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/kids-dashboard" element={<KidsDashboard />} />
      <Route path="/kids-tasks" element={<KidsTasksPage />} />
      <Route path="/stock-farm" element={<FarmersMarket />} />
      <Route path="/fruit-detail" element={<FruitDetail />} />
      <Route path="/parent-tasks" element={<ParentTaskPage />} />
      <Route path="/kids-monthly-statement" element={<KidMonthlyStatement />} />
      <Route path="/parent-monthly-statement" element={<ParentMonthlyStatement />} />
    </Routes>
  );
}

export default App;
