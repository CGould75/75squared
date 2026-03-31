import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import SEOHead from '../components/SEOHead';

const Home = () => {
  return (
    <>
      <SEOHead 
        title="Digital Marketing, SEO & App Development" 
        path="/"
        description="75 Squared is an elite Las Vegas digital agency providing Generative Engine Optimization (GEO), enterprise custom software, and data-driven marketing."
      />
      <Hero />
      <Services />
      <About />
    </>
  );
};

export default Home;
