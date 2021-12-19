import React from "react";
import SideNav from "./Components/SideNav/sidenav";
import "./App.css";
import Problems from "./Components/Problems/problems";
import Login from "./Components/Login/login.jsx";
import Register from "./Components/Register/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForgetPassword from "./Components/ForgetPassword/forgetpassword";
import Reset from "./Components/Reset/reset";
// import TopInterviewQuestions from "./Components/TopInterviewQuestions/topinterviewques";
import BreadCrumb from "./Components/Breadcrumb/breadcrumb";
import Home from "./Components/Home/home";
import DSASheet from "./Components/DSASheet/dsaSheet";

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
          <BreadCrumb />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route
              path="/top-interview-questions"
              element={<TopInterviewQuestions />}
            /> */}
            <Route path="/problems" element={<Problems />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dsasheet"
              search="?name=lovebabbar"
              element={<DSASheet />}
            />
            <Route
              path="/dsasheet"
              search="?name=striver"
              element={<DSASheet />}
            />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/reset/:token" element={<Reset />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
