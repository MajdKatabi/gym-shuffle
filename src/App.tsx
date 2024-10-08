import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home'
import GymDays from './pages/GymDays';
import GymPlan from './pages/GymPlan';
import GymShuffle from './pages/GymShuffle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gym-days" element={<GymDays />} />
          <Route path="/gym-plan" element={<GymPlan />} />
          <Route path="/gym-shuffle" element={<GymShuffle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
