'use client';

import { useState, useRef } from 'react';
import type { AnalysisResult } from '@/lib/ats';
import { analyzeResume } from '@/lib/ats';
import { Header } from '@/components/resume-ace/header';
import { AnalysisResults } from '@/components/resume-ace/analysis-results';
import { InputSection } from '@/components/resume-ace/input-section';
import { Toaster } from '@/components/ui/toaster';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (resume: string, jd: string, role: string) => {
    setResumeText(resume);
    setJobDescription(jd);
    setIsLoading(true);
    setAnalysis(null);
    // Simulate processing time for a better UX
    setTimeout(() => {
      const result = analyzeResume(resume, jd, role);
      setAnalysis(result);
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 500); 
  };
  
  const faqData = [
    {
      question: "What is an ATS resume checker?",
      answer: "An ATS resume checker is a tool that simulates how an Applicant Tracking System (ATS) parses and ranks your resume. It analyzes your resume for keywords, formatting, and other factors to give you an ATS score, helping you optimize it to pass automated screening."
    },
    {
      question: "What is a good ATS score?",
      answer: "A good ATS score is typically above 80%. This indicates that your resume is well-optimized for the target job description and has a high chance of passing the initial screening. Scores below 60% may need significant improvement."
    },
    {
      question: "Can ATS read PDF resumes?",
      answer: "Yes, most modern ATS can read PDF resumes. However, it's crucial that the PDF is text-based and not an image. Avoid complex formatting, tables, and columns, as some older systems might struggle to parse them correctly. A simple, clean PDF is the safest option."
    },
    {
      question: "How do I improve my ATS score?",
      answer: "To improve your ATS score, tailor your resume to the job description by including relevant keywords, use a clean and simple format, ensure all essential sections are present, and use action verbs to describe your accomplishments. Our tool provides specific suggestions for each of these areas."
    },
    {
        question: "Why do resumes get rejected by ATS?",
        answer: "Resumes are often rejected by ATS due to incompatible formatting (like tables, columns, or graphics), missing keywords from the job description, or a file type that the system cannot parse. Our checker helps you identify and fix these common issues."
    },
    {
        question: "Is this resume checker free?",
        answer: "Yes, our core ATS resume check is 100% free. It provides you with an ATS score and a basic analysis. We offer optional premium features for more in-depth suggestions and resume optimization."
    },
    {
        question: "Does ATS check grammar?",
        answer: "While the primary function of an ATS is to parse information and match keywords, some advanced systems have modules that can flag grammatical errors or spelling mistakes. It's always best to have a perfectly proofread resume."
    },
    {
        question: "How accurate is an ATS resume score?",
        answer: "Our ATS resume score is a highly accurate simulation based on the rules and algorithms used by popular Applicant Tracking Systems. While every ATS is slightly different, our score provides a strong directional indicator of your resume's performance."
    }
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        key="faq-jsonld"
      />
      <div className="flex min-h-screen flex-col bg-background font-body">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,42,241,0.15),rgba(255,255,255,0))]"></div>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <section className="text-center mb-12">
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                  ATS Resume Checker – Is Your Resume ATS Friendly?
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
                  An ATS resume checker helps you understand whether your resume can pass applicant tracking systems used by recruiters. Our free ATS resume checker analyzes your resume’s formatting, keywords, skills, and structure to generate an ATS score and actionable suggestions to improve your chances of getting interview calls.
                </p>
              </section>
              
              <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

              {isLoading && (
                <div className="mt-8 flex justify-center items-center flex-col text-center">
                  <LoadingSpinner className="h-8 w-8 text-primary"/>
                  <p className="mt-2 text-muted-foreground">Crunching the numbers...</p>
                </div>
              )}

              <div ref={resultsRef} className="mt-8 scroll-mt-20">
                {analysis ? (
                  <AnalysisResults 
                    analysis={analysis} 
                    resumeText={resumeText} 
                    jobDescription={jobDescription}
                  />
                ) : (
                  !isLoading && (
                    <Alert className="mt-8 bg-card/50 backdrop-blur-sm border border-border/20">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Awaiting Analysis</AlertTitle>
                      <AlertDescription>
                        Your analysis results will appear here once you check your ATS score.
                      </AlertDescription>
                    </Alert>
                  )
                )}
              </div>

              <section id="how-it-works" className="mt-24 text-center">
                <h2 className="text-4xl font-bold mb-4">How Our ATS Resume Checker Works</h2>
                <p className="max-w-3xl mx-auto text-muted-foreground mb-12">
                  Our tool simulates how a real Applicant Tracking System (ATS) sees your resume. We don't use AI magic, just rule-based logic to give you an honest, actionable score.
                </p>
              </section>

              <section id="checks" className="mt-16">
                <h2 className="text-4xl font-bold text-center mb-8">16 Crucial Checks We Perform on Your Resume</h2>
                <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-12">Our ATS resume checker performs 16 crucial checks including ATS parse rate, keyword matching, resume length, file format, quantified achievements, skills relevance, and active voice usage.</p>
              </section>

              <section id="what-is-ats-score" className="mt-16">
                <h2 className="text-4xl font-bold text-center mb-8">What is an ATS Score and Why It Matters</h2>
                <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-12">Your ATS score is a percentage (0-100) that predicts how well your resume will perform in an automated screening. A higher score means you've successfully matched the job's requirements and used an ATS-friendly format.</p>
              </section>

              <section id="how-to-improve" className="mt-16">
                <h2 className="text-4xl font-bold text-center mb-8">How to Improve Your Resume ATS Score</h2>
                <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-12">Improving your score involves tailoring keywords, simplifying formatting, quantifying your achievements, and using strong action verbs. Our analysis report gives you specific suggestions for each of these areas.</p>
              </section>

              <section id="pdf-check" className="mt-16">
                <h2 className="text-4xl font-bold text-center mb-8">Can ATS Read PDF Resumes?</h2>
                <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-12">Yes, most modern ATS can read PDFs perfectly. The key is to ensure your PDF is a text-based document, not an image. Avoid using complex layouts with tables, columns, or excessive graphics, as this can confuse older systems.</p>
              </section>

              <section id="faq" className="mt-24 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

            </div>
          </div>
        </main>
        <footer className="py-6 mt-16 text-center text-sm text-muted-foreground border-t">
          <div className="container">
            <p>&copy; 2024 ResumeAce. All rights reserved.</p>
            <div className="mt-4 text-xs space-x-2 md:space-x-4">
              <span className="font-semibold">Built by hiring & ATS research</span>
              <span>•</span>
              <span className="font-semibold">Based on real ATS rules</span>
              <span>•</span>
              <span className="font-semibold">Privacy guaranteed – resumes not stored (unless logged in)</span>
            </div>
          </div>
        </footer>
        <Toaster />
      </div>
    </>
  );
}
