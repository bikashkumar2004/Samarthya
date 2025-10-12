import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import ExtraSections from '../components/landing/ExtraSections';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <ExtraSections />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
