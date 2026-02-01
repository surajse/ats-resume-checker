'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "What is an ATS resume checker?",
        answer: "An ATS resume checker is a tool that simulates how Applicant Tracking Systems (ATS) parse and rank resumes. It helps you optimize your resume to pass these automated screening systems and reach a human recruiter."
    },
    {
        question: "What is a good ATS score?",
        answer: "A score above 80 is generally considered strong, indicating good ATS compatibility. Scores between 60-79 suggest areas for improvement, while scores below 60 have a high risk of being filtered out."
    },
    {
        question: "Can ATS read PDF resumes?",
        answer: "Yes, modern ATS can read text-based PDF files effectively. However, it's crucial to avoid complex formatting, images, and tables, as these can still cause parsing issues. Our checker verifies if your PDF is readable."
    },
    {
        question: "How do I improve my ATS score?",
        answer: "You can improve your score by tailoring keywords from the job description, using standard section headings (like \"Experience,\" \"Skills\"), quantifying your achievements with numbers, and ensuring your contact information is present and correctly formatted."
    },
    {
        question: "Why do resumes get rejected by ATS?",
        answer: "Resumes are often rejected for missing relevant keywords, having a format that the ATS can't parse (e.g., using tables or columns), lacking standard sections, or having critical information like contact details missing."
    },
    {
        question: "Is this resume checker free?",
        answer: "Yes! Our basic ATS analysis, which includes your overall score and a breakdown of checks, is completely free. We offer premium features for more advanced suggestions and optimizations."
    },
    {
        question: "Does ATS check grammar?",
        answer: "While ATS primarily focuses on keywords and structure, some advanced systems have basic grammar and spelling checks. More importantly, perfect grammar is crucial for the human recruiter who will read your resume after it passes the ATS."
    },
    {
        question: "How accurate is an ATS resume score?",
        answer: "Our score is a highly accurate simulation based on the common rules and patterns used by thousands of Applicant Tracking Systems. It provides a reliable benchmark to help you understand how your resume will perform, though the exact logic can vary between different ATS platforms."
    }
]

export function FaqSection() {
  return (
    <section className="mt-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-headline text-4xl font-extrabold tracking-tight text-primary mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-4 shadow-lg">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index} className={index === faqs.length - 1 ? 'border-b-0' : ''}>
              <AccordionTrigger className="text-left font-semibold text-lg hover:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
