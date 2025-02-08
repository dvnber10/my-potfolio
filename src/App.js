import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/home';
import About from './routes/About';
import Contact from './routes/contact';
import Proyects from './routes/Proyects';
import './styles/global.scss';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact/>} />
          <Route path="projects" element={<Proyects/>} />
        </Route>
      </Routes>
    </Router>
  );
}
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
