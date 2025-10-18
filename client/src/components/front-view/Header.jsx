import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Detect scroll to add shadow only
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-[1000] bg-[#dbe9db] transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-none"
      }`}
    >
      <div className="w-full flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <h1
            className="text-2xl font-bold text-[#043927] cursor-pointer ml-7"
            onClick={() => navigate("/")}
          >
            Cantar
          </h1>
        </div>

        {/* Center: Desktop Menu */}
        {/* <nav className="hidden md:flex flex-1 justify-center space-x-8">
          <a href="/" className="text-[#043927] hover:text-[#159740] transition">
            Home
          </a>
          <a href="/about" className="text-[#043927] hover:text-[#159740] transition">
            About
          </a>
          <a href="/pricing" className="text-[#043927] hover:text-[#159740] transition">
            Pricing
          </a>
          <a href="/contact" className="text-[#043927] hover:text-[#159740] transition">
            Contact
          </a>
        </nav> */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
            <div className="text-[#043927] hover:text-[#159740] transition" onClick={()=>navigate('/')}>
              Home
            </div>
            <div className="text-[#043927] hover:text-[#159740] transition" onClick={()=>navigate('/about')}>
              About
            </div>
            <div className="text-[#043927] hover:text-[#159740] transition" onClick={()=>navigate('/pricing')}>
              Pricing
            </div>
            <div className="text-[#043927] hover:text-[#159740] transition" onClick={()=>navigate('/contactus')}>
              Contact Us
            </div>
        </div>

        {/* Right: Login Button (Desktop) */}
        <div className="hidden md:flex flex-shrink-0">
          <button
            onClick={()=>navigate("/auth/register")}
            className="flex items-center gap-2 border border-[#159740] rounded-full px-6 py-2 hover:bg-[#159740] transition-all text-[#043927] mr-7"
          >
            Login <img src={assets.arrow_icon} alt="arrow"  />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex-shrink-0">
          <button
            className="text-[#043927]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#dbe9db] px-6 pb-4 space-y-3 animate-fadeIn">
          <a href="/" className="block text-[#043927] hover:text-[#159740]">Home</a>
          <a href="/about" className="block text-[#043927] hover:text-[#159740]">About</a>
          <a href="/pricing" className="block text-[#043927] hover:text-[#159740]">Pricing</a>
          <a href="/contact" className="block text-[#043927] hover:text-[#159740]">Contact</a>
          <button
            onClick={() => navigate("/auth/register")}
            className="w-full border border-[#159740] text-[#043927] px-4 py-2 rounded-lg hover:bg-[#159740] hover:text-white transition"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
