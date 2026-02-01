import { FileText } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary tracking-tight">ResumeAce</h1>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            Your AI-powered ATS resume checker
          </p>
        </div>
      </div>
    </header>
  );
}
