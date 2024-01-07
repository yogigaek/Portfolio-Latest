import React from 'react'
import './header.css'
import CTA from './CTA'
import ME from '../../assets/PUTIH-removebg-preview.png'
import HeaderSocials from './HeaderSocials'
import Typical from 'react-typical';

const Header = () => {
  return (
    <header>
      <div className="container header__container" id='home'>
        <h5>Hello I'm</h5>
        <h1>Muhammad Yogi</h1>
        <div className="profile_details">
          <h3 className="text-light">
            <Typical loop={Infinity} steps={['Fullstack Web Developer', 1000, 'Backend Engineer', 1000]} />
          </h3>
        </div>
        <CTA />
        <HeaderSocials />

        <div className="me">
          <div className="me-image">
            <img src={ME} alt="Muhammad Yogi" />
          </div>
        </div>

        <a href="#contact" className='scroll__down'>Scroll Down</a>
      </div>
    </header>
  )
}

export default Header