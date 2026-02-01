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
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                Get Your Resume ATS-Ready
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Paste your resume and a job description to see how well you match. Our tool analyzes keywords, formatting, and more to give you an instant ATS score.
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
                  <Alert className="mt-8 bg-card">
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
