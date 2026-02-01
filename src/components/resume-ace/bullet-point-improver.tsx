'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getImprovedResume } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Clipboard, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';

interface BulletPointImproverProps {
  resumeText: string;
  jobDescription: string;
}

export function BulletPointImprover({ resumeText, jobDescription }: BulletPointImproverProps) {
  const [isPending, startTransition] = useTransition();
  const [improvedResume, setImprovedResume] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleImprove = () => {
    startTransition(async () => {
      setImprovedResume('');
      const result = await getImprovedResume(resumeText, jobDescription);
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.improvedResumeText) {
        setImprovedResume(result.improvedResumeText);
      }
    });
  };
  
  const handleCopy = () => {
    if (!improvedResume) return;
    navigator.clipboard.writeText(improvedResume);
    setIsCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-start mb-4">
        <Button onClick={handleImprove} disabled={isPending}>
          {isPending ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Generating Suggestions...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Improvements
            </>
          )}
        </Button>
      </div>

      {isPending && !improvedResume && (
        <div className="flex items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
           <p className="text-muted-foreground">AI is warming up...</p>
        </div>
      )}

      {improvedResume && (
        <Card className="bg-secondary/30">
          <CardContent className="p-4">
            <div className="relative">
              <Textarea
                readOnly
                value={improvedResume}
                className="min-h-[300px] bg-card text-sm"
                aria-label="Improved Resume Output"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-4 w-4 text-chart-2" /> : <Clipboard className="h-4 w-4" />}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isPending && !improvedResume && (
         <Alert variant="default" className="bg-card">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Ready to Optimize!</AlertTitle>
            <AlertDescription>
                Click the button above to let our AI rewrite your resume's bullet points for better impact and clarity.
            </AlertDescription>
         </Alert>
      )}
    </div>
  );
}
