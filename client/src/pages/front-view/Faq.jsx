import React, { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

export default function Faq() {
  const faqItems = [
    {
      question: "Can I get a demo of Cantar CRM?",
      answer:
        "Yes, we would be happy to demonstrate Cantar CRM through a web-conference at your convenience. The demo is a one hour session. To schedule your personal session, please contact sales@cantar.com.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes, Cantar CRM ensures your data is safe with multiple layers of security measures.",
    },
    {
      question: "What types of payment do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers.",
    },
    {
      question: "Does Cantar CRM support multiple languages?",
      answer:
        "Yes, Cantar CRM supports multiple languages to cater to our global user base.",
    },
    {
      question: "How flexible are your contracts?",
      answer:
        "Our contracts are very flexible with options for monthly or yearly billing.",
    },
    {
      question: "What are Cantar CRM bundle plans?",
      answer:
        "Cantar CRM offers various bundle plans that include additional features and integrations.",
    },
    {
      question: "What is the difference between Cantar Plus and CRM Flex?",
      answer:
        "CRM Plus includes a fixed set of features, while CRM Flex allows you to customize and choose only the features you need.",
    },
    {
      question: "Can I switch plans?",
      answer: "Yes, you can switch plans at any time to better suit your needs.",
    },
    {
      question:
        "How do you support businesses signing up for Cantar CRM?",
      answer:
        "We provide onboarding assistance and 24/7 customer support to help businesses get started with Zoho CRM.",
    },
    {
      question:
        "Do you provide any assistance in getting Cantar CRM set up and running for our business?",
      answer:
        "Yes, we offer setup and implementation services to ensure a smooth transition.",
    },
    {
      question: "Does Cantar CRM have a free edition?",
      answer:
        "Yes, Cantar CRM offers a free edition with basic features for small businesses.",
    },
    {
      question: "Have more questions?",
      answer:
        "Feel free to contact our support team for any additional questions you may have.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const handleItemClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const AccordionItem = ({ faq, isOpen, onClick }) => (
    <div className="border-b border-gray-300 py-4 sm:py-5 transition-all">
      <button
        className="flex items-center w-full text-left font-semibold text-base sm:text-lg focus:outline-none"
        onClick={onClick}
      >
        <span className="mr-4 text-[#159740] text-xl sm:text-2xl">
          {isOpen ? <FaMinusCircle /> : <FaPlusCircle />}
        </span>
        {faq.question}
      </button>
      {isOpen && (
        <p className="mt-3 sm:mt-4 pl-10 text-gray-700 text-sm sm:text-base leading-relaxed">
          {faq.answer}
        </p>
      )}
    </div>
  );

  return (
    <section className="max-w-2xl mx-auto mt-12 sm:mt-16 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#043927]">
        Frequently Asked Questions
      </h2>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {faqItems.map((faq, index) => (
          <AccordionItem
            key={index}
            faq={faq}
            isOpen={index === openIndex}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </div>
    </section>
  );
}
