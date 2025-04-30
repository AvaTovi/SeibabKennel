import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo1.jpg';

const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand-fixed">
        <img src={logo} alt="Logo" className="nav-logo-img" />
        <span className="nav-logo-text">Seibab Kennel</span>
      </Link>

      <ul className="nav-menu">
        <li><Link to="/"></Link></li>
        <li><Link to="/info">Seibab Information</Link></li>
        <li><Link to="/about">About</Link></li>
        <li className="nav-contact"><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
