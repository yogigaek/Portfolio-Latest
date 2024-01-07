import React from 'react'
import Header from '../components/header/Header';
import Nav from '../components/nav/Nav';
import About from '../components/about/About';
import Experience from '../components/experience/Experience';
import Portfolio from '../components/portfolio/Portfolio';
import Contact from '../components/contact/Contact';
import Footer from '../components/footer/Footer'; 
import Testimonials from '../components/testimonials/Testimonials';
import Services from '../components/services/Services';
 
const routeComp = () => {
  return (
    <>
        <Header /> 
        <Nav />
        <About />
        <Experience />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
        <Footer />
    </>
  )
}

export default routeComp