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

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,42,241,0.15),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Get Your Resume ATS-Ready
              </h2>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
                Check your resume against any job description. Get an instant ATS score, keyword analysis, and AI-powered suggestions to land your dream job.
              </p>
            </div>
            
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
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} ResumeAce. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
