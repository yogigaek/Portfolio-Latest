import React from 'react'
import {BsLinkedin} from 'react-icons/bs'
import {FaGithub} from 'react-icons/fa'
import {FiInstagram} from 'react-icons/fi'


const HeaderSocials = () => {
  return (
    <div className='header__socials'>
        <a href="https://www.linkedin.com/in/muhammad-yogi-779483248/" target="_blank" rel='noreferrer'> <BsLinkedin /> </a>
        <a href="https://github.com/yogigaek" target="_blank" rel='noreferrer'> <FaGithub /> </a>
        <a href="https://www.instagram.com/mhdyogi24/" target="_blank" rel='noreferrer'> <FiInstagram /> </a>
    </div>
  )
}

export default HeaderSocials