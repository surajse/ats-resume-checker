'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface InputSectionProps {
  onAnalyze: (resume: string, jd: string, role: string) => void;
  isLoading: boolean;
}

export function InputSection({ onAnalyze, isLoading }: InputSectionProps) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [role, setRole] = useState('software-engineer');
  const { toast } = useToast();

  const handleButtonClick = () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume is empty',
        description: 'Please paste your resume text to begin analysis.',
        variant: 'destructive',
      });
      return;
    }
    onAnalyze(resumeText, jobDescription, role);
  };

  return (
    <Card className="shadow-lg border-2 border-transparent focus-within:border-primary transition-colors duration-300">
      <CardHeader>
        <CardTitle>Resume and Job Details</CardTitle>
        <CardDescription>
          Provide your resume, the job description, and select the role you're applying for.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Textarea
            placeholder="Paste your resume text here..."
            className="min-h-[300px] text-sm focus:ring-1 focus:ring-ring"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            aria-label="Resume Text Area"
          />
          <Textarea
            placeholder="Paste the job description here (optional)..."
            className="min-h-[300px] text-sm focus:ring-1 focus:ring-ring"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            aria-label="Job Description Text Area"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full sm:w-[280px]" aria-label="Select Role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="software-engineer">Software Engineer</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
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
