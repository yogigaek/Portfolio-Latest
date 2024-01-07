import React from 'react'
import './testimonials.css'
import AVTR1 from '../../assets/abi.jpeg'
import AVTR2 from '../../assets/fajri.jpeg'

// import Swiper core and required modules
import { Pagination } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const data = [
  {
    avatar: AVTR1,
    name: 'Fadhlillah I',
    work: 'Backend Engineer at PT Bank Danamon Indonesia, Tbk.',
    review: 'I was very impressed with Muhammad Yogi expertise in backend development. Yogi has a strong understanding of databases, APIs, and system integration. When working with him, I always see dedication in creating efficient and scalable solutions.'
  },
  {
    avatar: AVTR2,
    name: 'Fajri Illahi',
    work: 'Tech Lead at IFG Life',
    review: 'I would like to recommend Muhammad Yogi as a reliable backend Engineer. he has a very broad knowledge of system architecture, performance optimization, and security. yogi is always passionate about completing projects, and their good communication skills make collaboration smooth.'
  }
]

const Testimonials = () => {
  return (
    <section id='testimonials'>
      <h5>Review from Colleagues</h5>
      <h2>Testimonials</h2>

      <Swiper className="container testimonials__container"
      // install Swiper modules
      modules={[Pagination]}
      spaceBetween={40}
      slidesPerView={1}
      pagination={{ clickable: true }}> 
        {
          data.map(({avatar, name, work, review}, index) => {
            return (
              <SwiperSlide key={index} className="testimonial">
                <div className="client__avatar">
                  <img src={avatar} alt="Avatar One" />
                </div>
                <h5 className='client__name'>{name}</h5>
                <h6 className='client__name'>{work}</h6>
                <small className='client__review'>{review}</small>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
    </section>
  )
}

export default Testimonials