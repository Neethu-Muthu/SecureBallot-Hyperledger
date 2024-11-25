// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import CommissionerPage from "./components/CommissionerPage";
import VoterRegistrationAuthorityPage from "./components/VoterRegistrationAuthorityPage";
import AuditorPage from "./components/AuditorPage";

import VotingBooth from "./components/VotingBooth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/commissioner" element={<CommissionerPage />} />
        <Route
          path="/voter-registration-authority"
          element={<VoterRegistrationAuthorityPage />}
        />
        <Route path="/auditor" element={<AuditorPage />} />
        <Route path="/voting-booth" element={<VotingBooth />} />
      </Routes>
    </Router>
  );
}

export default App;
