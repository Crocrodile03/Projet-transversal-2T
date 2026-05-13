import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tes imports de pages
import Home from './pages/Home';
import DashboardPico from './pages/DashboardPico';
// Tu pourras ajouter import Logs from './pages/Logs' plus tard !

function App() {
  return (
    <Router>
      <Routes>
        {/* La page d'accueil classique */}
        <Route path="/" element={<Home />} />
        
        {/* Ta nouvelle page IoT */}
        <Route path="/pico" element={<DashboardPico />} />
      </Routes>
    </Router>
  );
}

export default App;