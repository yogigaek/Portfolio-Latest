import React from 'react'
import './footer.css'
import { BsGithub  } from 'react-icons/bs';
import { FiInstagram } from 'react-icons/fi';
import { BsLinkedin } from "react-icons/bs";

const Footer = () => {
  return (
    <footer>
      <a href="#home" className='footer__logo'>Muhammad Yogi</a>

      <ul className='permalinks'>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="footer__socials">
        <a href="https://github.com/yogigaek" target={'_blank'} rel="noreferrer"><BsGithub  /></a>
        <a href="https://www.instagram.com/mhdyogi24/" target={'_blank'} rel="noreferrer"><FiInstagram  /></a>
        <a href="https://www.linkedin.com/in/muhammad-yogi-779483248/" target={'_blank'} rel="noreferrer"><BsLinkedin /></a>
      </div>

      <div className="footer__copyright">
        <small>&copy; Muhammad Yogi Portfolio.</small>
      </div>
    </footer>
  )
}

export default Footer