// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Background from "./Components/Background/Background";
import Hero from "./Components/Hero/Hero";
import SeibabInformation from "./Components/SeibabInformation/SeibabInformation";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";

import "./App.css";

const App = () => (
  <>
    <Navbar />

    <Routes>
      {/* Home route inlined so you don’t need a separate Home.jsx */}
      <Route
        path="/"
        element={
          <div className="home-container">
            <Background playStatus={true} />
            <Hero heroData={{ /* your heroData props here if any */ }} />
          </div>
        }
      />

      <Route path="/info" element={<SeibabInformation />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>

    <Footer />
  </>
);

export default App;
