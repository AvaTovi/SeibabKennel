import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/home/home";
import AvailablePuppies from "./Components/AvailablePuppies/AvailablePuppies";
import Studs from "./Components/Studs/Studs";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Admin from "./Components/Admin/Admin";
import Footer from "./Components/Footer/Footer";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/available-puppies" element={<AvailablePuppies />} />
        <Route path="/studs" element={<Studs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;