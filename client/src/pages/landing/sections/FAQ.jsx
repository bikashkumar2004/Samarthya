import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQ() {
  const faqItems = [
    {
      id: "item-1",
      question: "What's Pixa playground?",
      answer:
        "Pixa's playground is an integrated webapp to seamlessly test different LLM models such as GPT4, Claude, Gemini, etc.",
    },
    {
      id: "item-2",
      question: "What are LLM?",
      answer:
        "LLM stands for Large Language Models. These are AI models trained on vast amounts of text data to understand and generate human-like responses.",
    },
    {
      id: "item-3",
      question: "Where can I test different AI models?",
      answer:
        "You can test different AI models directly in Pixa's playground interface, which provides a unified environment for comparing model responses.",
    },
    {
      id: "item-4",
      question: "Is Pixa Free to use?",
      answer:
        "Pixa offers free access to test various LLM models through its playground. Some advanced features may require a subscription.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Faq</h1>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-gray-700 py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
