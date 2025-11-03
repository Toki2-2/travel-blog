import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TravelLogs from './pages/TravelLogs';
import JourneyPlans from './pages/JourneyPlans';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Login</Link>
          {isLoggedIn && (
            <>
              <Link to="/travel-logs">Travel Logs</Link>
              <Link to="/journey-plans">Journey Plans</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route 
            path="/travel-logs" 
            element={isLoggedIn ? <TravelLogs /> : <Navigate to="/" />} 
          />
          <Route 
            path="/journey-plans" 
            element={isLoggedIn ? <JourneyPlans /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;