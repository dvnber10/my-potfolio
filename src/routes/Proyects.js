import React from 'react'
import Mave from '../images/Mave.png'
import '../styles/Proyects.scss'
import Plantas from '../images/Plantas.png'
import Walls from '../images/walls.png'

function Proyects() {
  return (
    <div className='cont'>
      <h1>Proyectos</h1>
      <p>En construcción...</p>
      <div className="container_proyects">
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src={Mave} alt='mave' />
              <h3>Mave</h3>
            </div>
            <div className='back'>
              <p>Una aplicación diseñada para ayudar a los usuarios a registrar y monitorear su estado de ánimo diario. A través de una interfaz intuitiva, los usuarios pueden seleccionar su estado emocional (feliz, triste, enojado, etc.), agregar notas descriptivas y visualizar gráficos de su progreso emocional a lo largo del tiempo (BackEnd)</p>
              <a href='https://github.com/dvnber10/MAVE' className='button'>Ver Git</a>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src='https://tecnosoluciones.com/wp-content/uploads/2023/03/tecnologia-gestion-recursos-humanos.png' alt='mave' />
              <h3>Recursos Humanos</h3>
            </div>
            <div className='back'>
              <p>Aplicacion desarrollada en MVC .Net para la gestion de recursos humanos, es una version alpha que cumple con funciones basicas de gestion de empleados</p>
              <a href='https://github.com/dvnber10/Recursos_Humanos' className='button'>Ver más</a>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src={Plantas} alt='mave' />
              <h3>Plantas</h3>
            </div>
            <div className='back'>
              <p>Aplicacion desarrollada en MVC para la gestion de enfermedades y plagas de las plantas, la cual muestra las posibles soluciones a las plagas mas comunes de cada planta </p>
              <a href='https://front-plantas.vercel.app/' className='button'>Ver Demo     </a>
              <a href='https://github.com/dvnber10/Plantas' className='button'>Ver Git</a>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3gJ40-SaTSLbwPo4oViqzgFmviUj2NCmEYQ&s' alt='mave' />
              <h3>Api con machine learning</h3>
            </div>
            <div className='back'>
              <p>Servicio de predicción de enfermedades en mascotas mediante el prosesamiento de datos con machine learning, en el cual se ingresan los datos clave del comportamiento de las mascotas para dar una posible enfermedad
              </p>
              <a href='https://github.com/dvnber10/ML-PetMonitor' className='button'>Ver Git</a>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src={Walls} alt='mave' />
              <h3>Servicio de wallpapers</h3>
            </div>
            <div className='back'>
              <p>Servicio de wallpapers creado para linux mediante el uso de feh y cloudinary para el cambio de fondo de pantalla de forma aleatorea cada 3 minutos, las imagenes pueden ser personalizadas en tu carpeta de cloudinary.</p>
              <a href='https://github.com/dvnber10/Walls-Arch' className='button'>Ver Git</a>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src='https://s1.elespanol.com/2018/03/12/actualidad/actualidad_291485332_130142393_977x600.jpg' alt='mave' />
              <h3>Spotipy</h3>
            </div>
            <div className='back'>
              <p>Script para el manejo de metadatos de spotify y su almacenamiento en mongo DB el cual puede buscar los artias y sus reproducciones segun los datos reguistrados en la aplicación</p>
              <a href='https://github.com/dvnber10/Spotipy'className='button'>Ver Git</a>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="proyects">
            <div className="front">
              <img className='img_proyect' src={Mave} alt='mave' />
              <h3>Mave</h3>
            </div>
            <div className='back'>
              <p>Una aplicación diseñada para ayudar a los usuarios a registrar y monitorear su estado de ánimo diario. A través de una interfaz intuitiva, los usuarios pueden seleccionar su estado emocional (feliz, triste, enojado, etc.), agregar notas descriptivas y visualizar gráficos de su progreso emocional a lo largo del tiempo (FrontEnd)</p>
              <a href='https://github.com/dhincapie2002/FrontMave' className='button'>Ver Git</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proyects