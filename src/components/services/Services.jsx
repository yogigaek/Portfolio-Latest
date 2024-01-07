import React from "react";
import "./services.css";
import { BsCheck } from "react-icons/bs";

const Services = () => {
  return (
    <section id="services">
      <h5>What I Offer</h5>
      <h2>Services</h2>

      <div className="container services__container">
        <article className="service">
          <div className="service__head">
            <h3>Backend Engineer</h3>
          </div>

          <ul className="service__list">
            <li>
              <BsCheck className="service__list-icon" />
              <p>
              Proficient in server-side languages such as Node.js, Php, Java and Golang.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Experienced in designing and developing scalable RESTful APIs.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Well-versed in managing and implementing databases, both SQL and
                NoSQL.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Understanding of server security, encryption and data protection
                methods.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Skilled in server-side performance tuning, troubleshooting, and
                debugging.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Familiarity with server deployment and management on cloud
                platforms like AWS, Google Cloud and Azure.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
              Proficient in Designing and implementing RESTful APIs for integration with third-party.
              </p>
            </li>
          </ul>
        </article>

        <article className="service">
          <div className="service__head">
            <h3>Fullstack Developer</h3>
          </div>

          <ul className="service__list">
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Strong front-end skills with HTML, CSS, JavaScript, and
                libraries like React.js and Vue.js.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Back-end development capabilities with server-side languages and
                database management.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Ability to design and develop responsive and interactive web
                applications.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Proficiency in handling full project life cycle, from conception
                to deployment.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
              Experience with version control systems like Git Hub and Git Lab, 
              and familiarity with continuous integration and deployment.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Adept at understanding user requirements and translating them
                into software solutions.
              </p>
            </li>
          </ul>
        </article>

        <article className="service">
          <div className="service__head">
            <h3>Web Development</h3>
          </div>

          <ul className="service__list">
            <li>
              <BsCheck className='service__list-icon'/>
              <p>Experience in unit testing and debugging, ensuring the delivery of high-quality and reliable web applications.</p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>Ability to build clean, modern, and user-friendly websites.</p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Experience in responsive web design, ensuring websites function
                well on various devices and screen sizes.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Understanding of web performance optimization techniques and SEO
                best practices.
              </p>
            </li>
            <li>
              <BsCheck className="service__list-icon" />
              <p>
                Adept at working with web services and APIs including REST and
                GraphQL.
              </p>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default Services;
