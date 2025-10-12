const Hero = () => {
  return (
    <section className="bg-primary text-white py-16 md:py-24 px-6 md:px-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Get More Done with{' '}
            <span className="text-secondary">whitespace</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Project management software that enables your teams to collaborate,
            plan, analyze and manage everyday tasks
          </p>
          <button className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-600 transition shadow-lg">
            Try Whitespace free →
          </button>
        </div>

        {/* Right Illustration Placeholder */}
        <div className="md:w-1/2">
          <div className="bg-blue-100 bg-opacity-20 backdrop-blur-sm rounded-lg p-8 md:p-12 h-64 md:h-96 flex items-center justify-center border border-blue-300 border-opacity-30">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-300 text-lg">Hero Illustration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
