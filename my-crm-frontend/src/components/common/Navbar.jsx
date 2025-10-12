import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-white py-5 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white px-3 py-1 rounded">
            <span className="text-primary font-bold text-lg">W</span>
          </div>
          <span className="text-xl font-bold">whitespace</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-10 text-lg">
          <li><a href="#products" className="hover:text-accent transition">Products</a></li>
          <li><a href="#solutions" className="hover:text-accent transition">Solutions</a></li>
          <li><a href="#resources" className="hover:text-accent transition">Resources</a></li>
          <li><a href="#pricing" className="hover:text-accent transition">Pricing</a></li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden lg:flex gap-6 items-center">
          <Link to="/login">
            <button className="px-10 py-3 bg-accent text-primary font-medium rounded-lg hover:bg-yellow-400 transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-8 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-blue-500 transition">
              Try Whitespace free →
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-6 space-y-4">
          <a href="#products" className="block hover:text-accent">Products</a>
          <a href="#solutions" className="block hover:text-accent">Solutions</a>
          <a href="#resources" className="block hover:text-accent">Resources</a>
          <a href="#pricing" className="block hover:text-accent">Pricing</a>
          <div className="flex flex-col gap-3 mt-4">
            <button className="px-8 py-3 bg-accent text-primary rounded-lg">Login</button>
            <button className="px-8 py-3 bg-secondary text-white rounded-lg">Try Free →</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
