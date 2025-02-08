import React, {useEffect, useState} from 'react'
import img_profile from '../images/WhatsApp Image 2025-01-23 at 1.35.46 PM.jpeg'
import '../styles/home.scss'
import { FaHtml5, FaReact, FaCss3Alt, FaGitAlt, FaDocker } from "react-icons/fa6";
import { TbBrandJavascript, TbBrandCSharp } from "react-icons/tb";
import { SiMongodb, SiMysql } from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";

function Home() {

  const languagesData = [
    { icon: <FaHtml5 className="icon" />, name: "HTML" },
    { icon: <FaCss3Alt className="icon" />, name: "CSS" },
    { icon: <TbBrandJavascript className="icon" />, name: "JavaScript" },
    { icon: <FaReact className="icon" />, name: "React" },
    { icon: <TbBrandCSharp className="icon" />, name: "C#" },
    { icon: <SiMongodb className="icon" />, name: "MongoDB" },
    { icon: <SiMysql className="icon" />, name: "MySQL" },
    { icon: <DiMsqlServer className="icon" />, name: "MSSQL" },
    { icon: <FaGitAlt className="icon" />, name: "Git" },
    { icon: <FaDocker className="icon" />, name: "Docker" },
  ];
  const [languages, setLanguages] = useState(languagesData);
  useEffect(() => {
    const interval = setInterval(() => {
      setLanguages((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    },2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='home'>
      <div className="container_home">
        <img src={img_profile} alt="profile" className='img_profile' />
      </div>
      <div className="container_home">
        <h3>¡Hola! Soy Duvan</h3>
        <p>Desarrollador web apasionado por la tecnología y el desarrollo web. Me encanta aprender cosas nuevas y compartir mi conocimiento con los demás. En mi tiempo libre, me gusta leer, ver películas y series, y jugar videojuegos. ¡Gracias por visitar mi portafolio!</p>
        <div className="languajes_content">
          <div className="languajes">
          {languages.map((lang, index) => (
              <div className="languaje" key={index}>
                {lang.icon}
                <p>{lang.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home