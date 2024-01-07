import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import './header.css';
import CTA from './CTA';
import ME from '../../assets/PUTIH-removebg-preview.png';
import HeaderSocials from './HeaderSocials';

const Header = () => {
  const jobTitles = ['Fullstack Web Developer', 'Backend Engineer'];
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    reset: true,
    onRest: () => {
      setTimeout(() => {
        setCurrentJobIndex((prevIndex) => (prevIndex + 1) % jobTitles.length);
      }, 1000);
    },
  });

  return (
    <header>
      <div className="container header__container" id="home">
        <h5>Hello I'm</h5>
        <h1>Muhammad Yogi</h1>
        <div className="profile_details">
          <animated.h3 className="text-light" style={props}>
            {jobTitles.map((title, index) => (
              <span key={index} style={{ display: index === currentJobIndex ? 'inline' : 'none' }}>
                {title}
                {index < jobTitles.length - 1 && ' '}
              </span>
            ))}
          </animated.h3>
        </div>
        <CTA />
        <HeaderSocials />

        <div className="me">
          <div className="me-image">
            <img src={ME} alt="Muhammad Yogi" />
          </div>
        </div>

        <a href="#contact" className="scroll__down">
          Scroll Down
        </a>
      </div>
    </header>
  );
};

export default Header;
