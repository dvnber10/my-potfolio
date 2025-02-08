import React from 'react'
import '../styles/contact.scss'
import { SiGmail, SiLinkedin } from "react-icons/si";
import { PiWhatsappLogoBold } from "react-icons/pi";
import { FaSquareGithub } from "react-icons/fa6";
import Curriculum from '../assets/File/CURRICULUM.pdf'

function Contact() { 
  return (
    <div>
      <div className='contact'>
        <h1>Contactame</h1>
        <h2>Información de contacto</h2>
        <p>Si tienes alguna pregunta o deseas colaborar en un proyecto, no dudes en contactarme. Estoy disponible en las siguientes plataformas:</p>
        <div className='contact_info'>
          <div className='contact_links'>
            <a href='mailto:dvnber10@gmail.com'>
              <SiGmail className='images_contact' />
            </a>
          </div>
          <div className='contact_links'>
            <a href='https://wa.me/qr/WF3LGLGG5CGFE1'>
              <PiWhatsappLogoBold className='images_contact' />
            </a>
          </div>
          <div className='contact_links'>
            <a href='https://www.linkedin.com/in/edgar-duvan-bernal-acero-43339a258/'>
              <SiLinkedin className='images_contact' />
            </a>
          </div>
          <div className='contact_links'>
            <a href='https://github.com/dvnber10'>
              <FaSquareGithub className='images_contact' />
            </a>
          </div>
        </div>
        <button className='contact_button'>
          <a className='span' href={Curriculum} download='CV_EdgarDuvanBernalAcero' >Descargar Curriculum</a>
        </button>
      </div>
    </div>
  )
}

export default Contact