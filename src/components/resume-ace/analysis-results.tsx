'use client';

import type { AnalysisResult } from '@/lib/ats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScoreCircle } from './score-circle';
import { BulletPointImprover } from './bullet-point-improver';
import { CheckCircle2, XCircle, FileText, PenTool, Bot, MessageSquareWarning } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  resumeText: string;
  jobDescription: string;
}

function ResultItem({ pass, text }: { pass: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {pass ? (
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-chart-2" />
      ) : (
        <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
      )}
      <span>{text}</span>
    </div>
  );
}

export function AnalysisResults({ analysis, resumeText, jobDescription }: AnalysisResultsProps) {
  const { score, wordCount, keywords, sections, formatting, actionVerbs } = analysis;
  const keywordMatchRatio = keywords.jdKeywords.length > 0 ? keywords.matched.length / keywords.jdKeywords.length : 1;

  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl">Analysis Report</CardTitle>
        <CardDescription>Here's a breakdown of your resume's ATS performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="content">Content & Format</TabsTrigger>
            <TabsTrigger value="improvements">AI Improvements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-4">
                <ScoreCircle score={score} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">ATS Checklist</h3>
                <ResultItem pass={keywordMatchRatio >= 0.5} text={`Keyword Match: ${keywords.matched.length} / ${keywords.jdKeywords.length}`} />
                <ResultItem pass={sections.pass} text="Critical sections present" />
                <ResultItem pass={wordCount.pass} text={`Ideal word count: ${wordCount.count} words`} />
                <ResultItem pass={formatting.pass} text="Clean formatting & professional language" />
                <ResultItem pass={actionVerbs.pass} text={`Strong action verbs used: ${actionVerbs.count}`} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="keywords" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-3"><CheckCircle2 className="h-5 w-5 text-chart-2" />Matched Keywords ({keywords.matched.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.matched.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                        {keywords.matched.length === 0 && <p className="text-sm text-muted-foreground">No keywords matched.</p>}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-3"><XCircle className="h-5 w-5 text-destructive" />Missing Keywords ({keywords.missing.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords.missing.slice(0, 20).map(kw => <Badge key={kw} variant="outline">{kw}</Badge>)}
                         {keywords.missing.length > 20 && <Badge variant="outline">...and {keywords.missing.length - 20} more</Badge>}
                        {keywords.missing.length === 0 && <p className="text-sm text-muted-foreground">Great job! No critical keywords are missing.</p>}
                    </div>
                </div>
            </div>
             <p className="text-sm text-muted-foreground mt-6">Your keyword density is <span className="font-bold text-primary">{keywords.density.toFixed(2)}%</span>. Aim for 1-2% for each key skill.</p>
          </TabsContent>

          <TabsContent value="content" className="mt-6 space-y-6">
             <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold flex items-center gap-2 mb-3"><FileText className="h-5 w-5 text-primary"/>Resume Structure</h4>
                  <div className="space-y-3">
                    <ResultItem pass={wordCount.pass} text={`Word Count: ${wordCount.count} (Ideal: 450-800)`} />
                    <ResultItem pass={sections.found.includes('experience')} text={`Experience section: ${sections.found.includes('experience') ? 'Found' : 'Missing'}`} />
                    <ResultItem pass={sections.found.includes('skills')} text={`Skills section: ${sections.found.includes('skills') ? 'Found' : 'Missing'}`} />
                    <ResultItem pass={sections.found.includes('education')} text={`Education section: ${sections.found.includes('education') ? 'Found' : 'Missing'}`} />
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold flex items-center gap-2 mb-3"><PenTool className="h-5 w-5 text-primary"/>Formatting</h4>
                  <div className="space-y-3">
                   <ResultItem pass={formatting.longParagraphs === 0} text={`Long paragraphs (>100 words): ${formatting.longParagraphs}`} />
                   <ResultItem pass={formatting.allCaps < 5} text={`Excessive capitalization: ${formatting.allCaps} words`} />
                  </div>
                </Card>
             </div>
             <Card className="p-4">
                <h4 className="font-semibold flex items-center gap-2 mb-2"><MessageSquareWarning className="h-5 w-5 text-primary"/>Weak Language</h4>
                <p className="text-sm text-muted-foreground mb-3">These phrases can weaken your resume's impact. Consider replacing them.</p>
                {formatting.weakVerbs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formatting.weakVerbs.map(verb => <Badge key={verb} variant="destructive">{verb}</Badge>)}
                  </div>
                ) : <ResultItem pass={true} text="No weak verbs found. Well done!"/>}
             </Card>
          </TabsContent>

          <TabsContent value="improvements" className="mt-6">
            <h3 className="font-semibold flex items-center gap-2 mb-2 text-lg"><Bot className="h-5 w-5 text-primary"/>AI-Powered Bullet Point Enhancer</h3>
            <p className="text-muted-foreground text-sm mb-4">Transform your experience from passive to action-oriented. Our AI will rewrite your bullet points for maximum impact.</p>
            <BulletPointImprover resumeText={resumeText} jobDescription={jobDescription} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
