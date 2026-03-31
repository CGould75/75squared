import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServicePage from './pages/ServicePage';
import Contact from './pages/Contact';

function App() {
  return (
    <>
      {/* Navigation and Footer wrap the routes so they stay consistent on every page */}
      <Navigation />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      
      <Footer />
    </>
  );
}

export default App;
