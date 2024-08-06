import React from "react";
import Login from "./Pages/Login.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeePanel from "./Pages/EmployeePanel.js";

import AdminPanel from "./Pages/AdminPanel.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/employeepanel/*" element={<EmployeePanel />} />
          <Route path="/adminpanel/*" element={<AdminPanel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
