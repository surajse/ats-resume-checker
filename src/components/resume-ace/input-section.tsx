'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { ResumeUpload } from './resume-upload';

interface InputSectionProps {
  onAnalyze: (file: File, text: string) => void;
  isLoading: boolean;
  resetAnalysis: () => void;
}

export function InputSection({ onAnalyze, isLoading, resetAnalysis }: InputSectionProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const { toast } = useToast();

  const handleTextExtracted = (text: string, file: File) => {
    setResumeText(text);
    setResumeFile(file);
  };

  const handleButtonClick = () => {
    if (!resumeFile || !resumeText) {
      toast({
        title: 'Resume is empty',
        description: 'Please upload your resume to begin analysis.',
        variant: 'destructive',
      });
      return;
    }
    onAnalyze(resumeFile, resumeText);
  };

  const handleReset = () => {
    setResumeFile(null);
    setResumeText('');
    resetAnalysis();
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/20 shadow-xl">
      <CardHeader>
        <CardTitle>Check Your Resume</CardTitle>
        <CardDescription>
          Upload your resume file to see your ATS score. It's free and secure.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ResumeUpload onTextExtracted={handleTextExtracted} resetAnalysis={handleReset} />
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleButtonClick}
            disabled={isLoading || !resumeText}
            size="lg"
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-200 hover:scale-105"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Analyzing...
              </>
            ) : (
              'Check ATS Score'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
