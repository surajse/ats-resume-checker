'use client';

import { useState, useRef } from 'react';
import type { AnalysisResult } from '@/lib/ats';
import { analyzeResume } from '@/lib/ats';
import { Header } from '@/components/resume-ace/header';
import { AnalysisResults } from '@/components/resume-ace/analysis-results';
import { InputSection } from '@/components/resume-ace/input-section';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

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

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,42,241,0.05),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <section className="text-center mb-12">
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                ATS Resume Checker
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
                Is your resume good enough to pass the applicant tracking systems used by top companies? Upload it now to get your free ATS score and a detailed analysis.
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
