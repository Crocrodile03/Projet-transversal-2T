import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import DashboardPico from './pages/dashboardPico';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ element }: { element: React.ReactElement }) {
  return localStorage.getItem('accessToken') ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/pico" element={<PrivateRoute element={<DashboardPico />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;