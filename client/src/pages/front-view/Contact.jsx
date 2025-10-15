import { assets } from "../../assets/assets";


export default function Contact() {
  return (
    <div className="w-full grid place-items-center">
      <h1 className="mt-8 text-3xl font-bold text-center">
        Talk to our team to get started
      </h1>
      <img src={assets.undraw} alt="Contact" className="my-6 w-80 md:w-96 lg:w-150" />
      <h3 className="text-xl font-semibold mb-4">Let's talk business</h3>
      <ul className="text-center space-y-2">
        <li>Phone: (123) 456-7890</li>
        <li>Email: support@crm-solutions.com</li>
        <li>Address: 123 Business St, Suite 100, City, State</li>
      </ul>
    </div>
  );
};

