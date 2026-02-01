'use client';

import type { AnalysisResult } from '@/lib/ats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, XCircle, Crown, FileText, Briefcase, DraftingCompass } from 'lucide-react';
import { ScoreCircle } from './score-circle';
import { Progress } from '@/components/ui/progress';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

function ResultItem({ pass, text, premium, details }: { pass: boolean; text: string; premium: boolean; details: string; }) {
  return (
    <AccordionItem value={text} className="border-b-0">
      <AccordionTrigger className="py-3 text-sm hover:no-underline [&[data-state=open]>svg:first-child]:text-accent">
         <div className="flex items-center gap-3">
          {pass ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-chart-2" />
          ) : (
            <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
          )}
          <span className="flex-1 text-left">{text}</span>
          {premium && <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2 pl-10 text-xs text-muted-foreground">
        {details}
        {premium && !pass && <p className="text-yellow-600 mt-1">This is a premium suggestion.</p>}
      </AccordionContent>
    </AccordionItem>
  );
}


function CategoryCard({ title, icon, score, checks }: { title: string, icon: React.ReactNode, score: number, checks: AnalysisResult['content']['checks']}) {
  return (
    <Card className="bg-secondary/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              {icon} {title}
            </CardTitle>
            <span className="font-bold">{score}%</span>
        </CardHeader>
        <CardContent>
            <Progress value={score} className="h-2 mb-4" />
            <Accordion type="multiple" className="w-full">
              {checks.map(check => (
                <ResultItem key={check.name} pass={check.pass} text={check.name} premium={check.premium} details={check.details}/>
              ))}
            </Accordion>
        </CardContent>
    </Card>
  )
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { score, issueCount, content, sections, atsEssentials } = analysis;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/20 shadow-xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl">Analysis Report</CardTitle>
        <CardDescription>{issueCount > 0 ? `Your resume has ${issueCount} issues that need attention.` : `Great work! Your resume looks solid.`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-4 md:col-span-1">
                <ScoreCircle score={score} />
              </div>
              <div className="md:col-span-2 grid gap-6">
                <CategoryCard title="Content" icon={<FileText className="h-4 w-4"/>} score={content.score} checks={content.checks} />
              </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <CategoryCard title="Sections" icon={<Briefcase className="h-4 w-4"/>} score={sections.score} checks={sections.checks} />
            <CategoryCard title="ATS Essentials" icon={<DraftingCompass className="h-4 w-4"/>} score={atsEssentials.score} checks={atsEssentials.checks} />
          </div>
      </CardContent>
    </Card>
  );
}
