'use client';

import { useState, useRef } from 'react';
import type { AnalysisResult } from '@/lib/ats';
import { analyzeResume } from '@/lib/ats';
import { Header } from '@/components/resume-ace/header';
import { AnalysisResults } from '@/components/resume-ace/analysis-results';
import { InputSection } from '@/components/resume-ace/input-section';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, ShieldCheck, Zap, ServerOff, Infinity, BarChart, FileText, Briefcase, DraftingCompass, UserCheck, Search } from 'lucide-react';
import { FaqSection } from '@/components/resume-ace/faq-section';

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (file: File, text: string) => {
    setIsLoading(true);
    setAnalysis(null);
    setResumeText(text);

    // Simulate analysis time
    setTimeout(() => {
        const result = analyzeResume(text, file);
        setAnalysis(result);
        setIsLoading(false);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, 500);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setResumeText('');
  }

  const analysisFeatures = [
    { icon: BarChart, title: 'ATS Parse Rate', description: "Checks if your resume's text is readable by automated systems." },
    { icon: Search, title: 'Resume Keyword Matching', description: 'Compares your resume keywords against job description needs.' },
    { icon: Briefcase, title: 'Resume Sections Detection', description: 'Ensures all critical sections like Experience and Skills are found.' },
    { icon: UserCheck, title: 'Skills Relevance', description: 'Analyzes the hard and soft skills listed for job relevance.' },
    { icon: DraftingCompass, title: 'Formatting Compatibility', description: 'Verifies the layout is simple and ATS-friendly.' },
    { icon: FileText, title: 'Quantified Achievements', description: 'Looks for numbers and metrics that prove your impact.' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,42,241,0.05),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <section className="text-center mb-12">
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Free ATS Resume Checker – Get Your Resume Score Instantly
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
                Is Your Resume ATS-Friendly? Upload your resume and get an instant ATS score based on parsing, keywords, and resume quality — 100% private.
              </p>
            </section>
            
            <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} resetAnalysis={resetAnalysis} />

            {isLoading && (
              <div className="mt-8 flex justify-center items-center flex-col text-center">
                <LoadingSpinner className="h-8 w-8 text-primary"/>
                <p className="mt-2 text-muted-foreground">Analyzing your resume...</p>
              </div>
            )}

            <div ref={resultsRef} className="mt-8 scroll-mt-20">
              {analysis ? (
                <AnalysisResults 
                  analysis={analysis}
                />
              ) : (
                !isLoading && (
                  <Alert className="mt-8 bg-card/50 backdrop-blur-sm border border-border/20">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Awaiting Analysis</AlertTitle>
                    <AlertDescription>
                      Your analysis results will appear here once you upload your resume.
                    </AlertDescription>
                  </Alert>
                )
              )}
            </div>
          </div>
          
          {!analysis && !isLoading && (
            <>
              <section className="mt-20">
                <h2 className="text-center font-headline text-4xl font-extrabold tracking-tight text-primary mb-8">
                  What ResumeAce's ATS Resume Checker Analyzes
                </h2>
                <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {analysisFeatures.map(feature => (
                    <div key={feature.title} className="bg-card/50 p-4 rounded-lg border border-border/20 flex items-start gap-3">
                        <feature.icon className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-primary">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-20 text-center">
                <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary mb-8">How Our ATS Resume Checker Works</h2>
                <div className="max-w-3xl mx-auto text-muted-foreground grid md:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-accent-foreground font-bold text-2xl mb-2">1</div>
                    <h3 className="font-semibold text-primary">Upload Resume</h3>
                    <p className="text-sm">Upload your resume in PDF or DOCX format.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-accent-foreground font-bold text-2xl mb-2">2</div>
                    <h3 className="font-semibold text-primary">Browser-Based Parsing</h3>
                    <p className="text-sm">Your resume is parsed locally in your browser. Nothing is uploaded.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-accent-foreground font-bold text-2xl mb-2">3</div>
                    <h3 className="font-semibold text-primary">ATS Analysis</h3>
                    <p className="text-sm">We analyze it against 16+ ATS compatibility checks.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-accent-foreground font-bold text-2xl mb-2">4</div>
                    <h3 className="font-semibold text-primary">Score & Tips</h3>
                    <p className="text-sm">Get your score and actionable tips to improve.</p>
                  </div>
                </div>
              </section>

              <section className="mt-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-center font-headline text-4xl font-extrabold tracking-tight text-primary mb-8">What is an Applicant Tracking System (ATS)?</h2>
                    <p className="text-lg text-muted-foreground text-center mb-6">An Applicant Tracking System (ATS) is software used by companies to manage job applications. It scans resumes to find the most qualified candidates by looking for specific keywords, skills, and formatting. If a resume isn't 'ATS-friendly,' it can be automatically rejected before a human ever sees it.</p>
                </div>
              </section>
              
              <section className="mt-20">
                  <h2 className="text-center font-headline text-4xl font-extrabold tracking-tight text-primary mb-8">
                      Why ResumeAce Is Different
                  </h2>
                  <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                      <div className="flex flex-col items-center">
                          <ShieldCheck className="h-10 w-10 text-accent mb-2"/>
                          <h3 className="font-semibold text-primary mb-1">No Signup Required</h3>
                          <p className="text-sm text-muted-foreground">Get your score instantly without creating an account.</p>
                      </div>
                      <div className="flex flex-col items-center">
                          <ServerOff className="h-10 w-10 text-accent mb-2"/>
                          <h3 className="font-semibold text-primary mb-1">Runs Locally in Browser</h3>
                          <p className="text-sm text-muted-foreground">Your resume is never uploaded. Your data stays private.</p>
                      </div>
                      <div className="flex flex-col items-center">
                          <Zap className="h-10 w-10 text-accent mb-2"/>
                          <h3 className="font-semibold text-primary mb-1">Instant & Fast</h3>
                          <p className="text-sm text-muted-foreground">Our checker is lightweight and gives you results in seconds.</p>
                      </div>
                      <div className="flex flex-col items-center">
                          <Infinity className="h-10 w-10 text-accent mb-2"/>
                          <h3 className="font-semibold text-primary mb-1">Free Forever</h3>
                          <p className="text-sm text-muted-foreground">Our core ATS checks are always free for job seekers.</p>
                      </div>
                  </div>
              </section>
            </>
          )}

          <FaqSection />
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
            <span className="font-semibold">Privacy guaranteed – resumes not stored</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
