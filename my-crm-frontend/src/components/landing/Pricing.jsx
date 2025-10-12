import { FiCheck } from 'react-icons/fi';

const Pricing = () => {
  return (
    <section id="pricing" className="bg-white py-32 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-6xl font-bold text-dark mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-20">
          Whether you want to get organized, keep your personal life on track, or boost
          workplace productivity, Evernote has the right plan for you.
        </p>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 text-left hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-5xl font-bold mb-8">$0</p>
            <p className="text-gray-600 mb-8">Capture ideas and find them quickly</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Sync unlimited devices</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>10 GB monthly uploads</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>200 MB max. note size</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Customize Home dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Connect primary Google Calendar</span>
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-accent text-dark font-semibold rounded-lg hover:bg-accent transition">
              Get Started
            </button>
          </div>

          {/* Personal Plan (Highlighted) */}
          <div className="bg-primary text-white rounded-2xl p-10 text-left transform scale-105 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Personal</h3>
            <p className="text-5xl font-bold mb-8 text-accent">$11.99</p>
            <p className="text-gray-200 mb-8">Keep home and family on track</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <FiCheck className="text-accent text-xl mt-1" />
                <span>Sync unlimited devices</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-accent text-xl mt-1" />
                <span>10 GB monthly uploads</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-accent text-xl mt-1" />
                <span>200 MB max. note size</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-accent text-xl mt-1" />
                <span>Customize Home dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-accent text-xl mt-1" />
                <span>Connect primary Google Calendar</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-accent text-xl mt-1" />
                <span>Add due dates, reminders</span>
              </li>
            </ul>
            <button className="w-full py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-500 transition">
              Get Started
            </button>
          </div>

          {/* Organization Plan */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 text-left hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-2">Organization</h3>
            <p className="text-5xl font-bold mb-8">$49.99</p>
            <p className="text-gray-600 mb-8">Capture ideas and find them quickly</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Sync unlimited devices</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Unlimited monthly uploads</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>200 MB max. note size</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Customize Home dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheck className="text-dark text-xl mt-1" />
                <span>Access to all features</span>
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-accent text-dark font-semibold rounded-lg hover:bg-accent transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
