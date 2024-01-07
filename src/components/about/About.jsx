import React from "react";
import "./about.css";
import ME from "../../assets/BIRU.jpg";
import { FaAward } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { VscFolderLibrary } from "react-icons/vsc";

const About = () => {
  return (
    <section id="about">
      <h5>Get To Know</h5>
      <h2>About Me</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="My photos" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className="about__card">
              <FaAward className="about__icon" />
              <h5>Experience</h5>
              <small>2 years as a web developer</small>
            </article>

            <article className="about__card">
              <FiUsers className="about__icon" />
              <h5>Field of work</h5>
              <small>Backend Engineer, </small>
              <small>Fullstack web developer</small>
            </article>

            <article className="about__card">
              <VscFolderLibrary className="about__icon" />
              <h5>Projects</h5>
              <small>10+ completed </small>
              <small>Designed over 150+ RESTful APIs</small>
            </article>
          </div>

          <p>
            As a Backend Software Engineer with two years of experience in
            healthcare & warehouse data management, and software house. I have
            honed my skills in design, problem-solving, and software
            implementation. Passionate about learning and growth, I continuously
            expand my expertise in algorithms, data structures, and system
            design while staying updated on the latest IT trends. A team player
            and open-minded professional, I enjoy sharing knowledge and
            embracing new ideas. Currently enthusiastic about the Node.Js and
            Next.Js technologies stack, I am committed to delivering impactful
            contributions and striving for excellence in my role.
          </p>

          <a href="#contact" className="btn btn-primary">
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
