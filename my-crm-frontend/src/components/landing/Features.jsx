import { FiArrowRight } from 'react-icons/fi';
import { FaUsers, FaRocket, FaChartLine, FaCog, FaShieldAlt, FaClipboardList, FaSlack, FaGoogle, FaTrello } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { BsGear, BsPuzzle } from 'react-icons/bs';

const Features = () => {
  return (
    <>
      {/* Project Management Section */}
      <section className="bg-white py-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-6xl font-bold text-dark leading-tight">
              Project Management
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Images, videos, PDFs and audio files are supported. Create math expressions
              and diagrams directly from the app. Take photos with the mobile app and save
              them to a note.
            </p>
            <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
              Get Started <FiArrowRight />
            </button>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-blue-50 rounded-2xl p-20 border border-blue-100">
              <HiUsers className="text-9xl text-blue-300 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Work Together Section */}
      <section className="bg-white py-32 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-dark mb-6">Work together</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            With whitespace, share your notes with your colleagues and collaborate on them.
            You can also publish a note to the internet and share the URL with others.
          </p>

          {/* Icon Grid */}
          <div className="flex justify-center flex-wrap gap-8 mb-12">
            <IconBubble icon={<FaUsers />} color="bg-red-500" />
            <IconBubble icon={<FaChartLine />} color="bg-green-500" />
            <IconBubble icon={<FaSlack />} color="bg-blue-500" />
            <IconBubble icon={<BsGear />} color="bg-yellow-500" />
            <IconBubble icon={<FaRocket />} color="bg-purple-500" />
            <IconBubble icon={<FaGoogle />} color="bg-pink-500" />
            <IconBubble icon={<FaTrello />} color="bg-indigo-500" />
            <IconBubble icon={<FaShieldAlt />} color="bg-teal-500" />
            <IconBubble icon={<BsPuzzle />} color="bg-orange-500" />
            <IconBubble icon={<FaClipboardList />} color="bg-cyan-500" />
          </div>

          <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2 mx-auto">
            Try it now <FiArrowRight />
          </button>
        </div>
      </section>

      {/* Use as Extension Section */}
      <section className="bg-primary text-white py-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-6xl font-bold leading-tight">
              Use as Extension
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              Use the web clipper extension, available on Chrome and Firefox, to save web
              pages or take screenshots as notes.
            </p>
            <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
              Let's Go <FiArrowRight />
            </button>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-blue-50 bg-opacity-10 backdrop-blur-sm rounded-2xl p-20 border border-white border-opacity-20">
              <BsPuzzle className="text-9xl text-blue-200 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Customise Section */}
      <section className="bg-white py-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <div className="bg-blue-50 rounded-2xl p-20 border border-blue-100">
              <BsGear className="text-9xl text-blue-300 mx-auto" />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-6xl font-bold text-dark leading-tight">
              Customise it to your needs
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Customise the app with plugins, custom themes and multiple text editors (Rich
              Text or Markdown). Or create your own scripts and plugins using the Extension
              API.
            </p>
            <button className="px-8 py-4 bg-secondary text-white text-lg font-medium rounded-lg hover:bg-blue-500 transition flex items-center gap-2">
              Let's Go <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

const IconBubble = ({ icon, color }) => {
  return (
    <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform`}>
      {icon}
    </div>
  );
};

export default Features;
