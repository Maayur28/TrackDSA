import React from "react";
import Nav from "./Components/Nav/nav";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
      </Router>
    </div>
  );
}

export default App;
