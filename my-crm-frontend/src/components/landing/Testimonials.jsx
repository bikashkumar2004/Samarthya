const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'Whitespace is designed as a collaboration tool for businesses that is a full project management solution.',
      author: 'Oberon Shaw, MCH',
      role: 'Head of Talent Acquisition, North America',
      avatar: '👤',
    },
    {
      quote:
        'Whitespace has completely transformed how our team collaborates. The AI calling feature is a game changer for customer engagement.',
      author: 'Morgan Baker, CEO',
      role: 'Founder & CEO, TechVentures',
      avatar: '👨‍💼',
    },
    {
      quote:
        'The automated workflows and analytics saved us countless hours. Highly recommend for any growing business.',
      author: 'Sarah Chen, PM',
      role: 'Project Manager, InnovateLabs',
      avatar: '👩‍💻',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24 px-6 md:px-12">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What Our Clients <span className="text-secondary">Says</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          See how whitespace is helping businesses transform their workflow
        </p>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
      <div className="text-4xl mb-4">💬</div>
      <p className="text-gray-700 italic mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
          {avatar}
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
