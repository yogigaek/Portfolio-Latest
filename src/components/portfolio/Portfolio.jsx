import React from 'react'
import { Link } from 'react-router-dom';
import './portfolio.css'
import IMG1 from '../../assets/ss2.png';
import IMG2 from '../../assets/det1.png';

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'E-COMMERCE Website',
    github: "https://github.com/yogigaek/ecommerce-app",
    demo: 'https://store.muhammadyogi.website/',
    detail: <Link to={'/detail'} className="btn btn-primary">
            Detail
            </Link>
  }, 
  {
    id: 2,
    image: IMG2,
    title: 'E-COMMERCE Website',
    github: "https://github.com/yogigaek/App-Market-Place",
    demo: 'https://share.vidyard.com/watch/bn6RHvzhVw7DxAbSPRM3UD?',
    detail: <Link to={'/detail2'} className="btn btn-primary">
              Detail
            </Link>
  }
]

const Portfolio = () => {
  return (
    <section id='portfolio'>
      <h5>Some Projects</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">
        {
          data.map(({id, image, title, github, demo, detail}) => {
            return (
              <article key={id} className='portfolio__item'>
                  <div className="portfolio__item-image">
                    <img src={image} alt={title} />
                  </div>
                    <h3>{title}</h3>
                    <div className="portfolio__item-cta">
                      <a href={github} className='btn' target='_blank' rel='noreferrer'>Github</a>
                      <a href={demo} className='btn btn-primary' target='_blank' rel='noreferrer'>Live Demo</a>
                      <span>{detail}</span>
                    </div>
              </article>      
            )
          })
        }
      </div>
    </section>
  )
}

export default Portfolio