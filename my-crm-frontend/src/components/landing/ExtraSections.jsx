import { FaApple, FaMicrosoft, FaGoogle } from 'react-icons/fa';
import { SiSlack } from 'react-icons/si';
import { FiArrowRight } from 'react-icons/fi';

const ExtraSections = () => {
  return (
    <>
      {/* Work Everywhere Section */}
      <section className="bg-primary text-white py-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-6xl font-bold leading-tight">
              Your work, everywhere you are
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              Access your notes from your computer, phone or tablet by synchronising with
              various services, including whitespace, Dropbox and OneDrive. The app is
              available on Windows, macOS, Linux, Android and iOS. A terminal app is also
              available!
            </p>
            <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
              Try Taskey <FiArrowRight />
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="text-9xl">👩‍💼</div>
          </div>
        </div>
      </section>

      {/* 100% Data Section */}
      <section className="bg-white py-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-6xl font-bold text-dark leading-tight">
              100% your data
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              The app is open source and your notes are saved to an open format, so you'll
              always have access to them. Uses End-To-End Encryption (E2EE) to secure your
              notes and ensure no-one but yourself can access them.
            </p>
            <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
              Read more <FiArrowRight />
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="text-9xl">🔒</div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-dark mb-16">Our sponsors</h2>
          <div className="flex justify-center items-center gap-20 flex-wrap">
            <FaApple className="text-7xl text-gray-800" />
            <FaMicrosoft className="text-7xl text-blue-600" />
            <SiSlack className="text-7xl text-purple-600" />
            <FaGoogle className="text-7xl text-red-600" />
          </div>
        </div>
      </section>

      {/* Favorite Apps Section */}
      <section className="bg-primary text-white py-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-6xl font-bold leading-tight">
              Work with Your Favorite Apps Using whitespace
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              Whitespace teams up with your favorite software. Integrate with over 1000+ apps
              with Zapier to have all the tools you need for your project success.
            </p>
            <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
              Read more <FiArrowRight />
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center flex-wrap gap-8">
            <AppIcon icon={<FaGoogle />} />
            <AppIcon icon={<SiSlack />} />
            <AppIcon icon={<FaMicrosoft />} />
            <AppIcon icon={<FaApple />} />
          </div>
        </div>
      </section>
    </>
  );
};

const AppIcon = ({ icon }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center text-4xl border border-white border-opacity-20 hover:scale-110 transition">
      {icon}
    </div>
  );
};

export default ExtraSections;
