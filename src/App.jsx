import React from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Background from './Components/Background/Background';
import Hero from './Components/Hero/Hero';
import Contact from './Components/Contact/Contact';
import About from './Components/About/About';
import SeibabInformation from './Components/SeibabInformation/SeibabInformation';
import Footer from './Components/Footer/Footer'; // ✅ Make sure this exists
import './App.css';

const Home = () => {
  return (
    <div className="home-container">
      <Background playStatus={true} />
      <Hero heroData={{ }} />
    </div>
  );
};

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/info" element={<SeibabInformation />} />
    </Routes>
    <Footer /> {/* ✅ Footer visible on all pages */}
  </>
);

export default App;
