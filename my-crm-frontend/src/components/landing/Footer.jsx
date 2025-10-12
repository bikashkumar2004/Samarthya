import { FaApple, FaWindows, FaAndroid } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="bg-primary text-white py-16 md:py-20 px-6 md:px-12 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try Whitespace <span className="text-secondary">today</span>
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Get started for free. Add your whole team as your needs grow.
          </p>
          <button className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-600 transition shadow-lg mb-8">
            Start today →
          </button>

          {/* Platform Icons */}
          <div className="flex justify-center gap-6 text-3xl">
            <FaApple className="hover:text-secondary cursor-pointer transition" />
            <FaWindows className="hover:text-secondary cursor-pointer transition" />
            <FaAndroid className="hover:text-secondary cursor-pointer transition" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-6 md:px-12 border-t border-blue-800">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">whitespace</h3>
            <p className="text-gray-300 text-sm">
              Whitespace was created as the world's first smart AI-CRM to help you manage your business better.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Overview
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Customer stories
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Guides & tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Help center
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-secondary transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Media kit
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto mt-8 pt-8 border-t border-blue-800 text-center text-sm text-gray-400">
          <p>© 2025 Whitespace LLC. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
