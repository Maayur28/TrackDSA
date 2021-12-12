import React from "react";
import SideNav from "./Components/SideNav/sidenav";
import "./App.css";
import Problems from "./Components/Problems/problems";
import Login from "./Components/Login/login.jsx";
import Register from "./Components/Register/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForgetPassword from "./Components/ForgetPassword/forgetpassword";
import Reset from "./Components/Reset/reset";

function App() {
  return (
    <div className="App">
      <Router>
        <SideNav />
        <div
          style={{
            width: localStorage.getItem("sideNavCollapsed") ? "96vw" : "90vw",
          }}
        >
          <Routes>
            <Route path="/" element={<Problems />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/reset/:token" element={<Reset />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
