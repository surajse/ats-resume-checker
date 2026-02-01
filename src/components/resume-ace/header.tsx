import { FileText, Rss } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary tracking-tight">ResumeAce</h1>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/blog" passHref>
               <Button variant="ghost">
                  <Rss className="h-4 w-4 md:mr-2"/>
                  <span className="hidden md:inline">Blog</span>
               </Button>
            </Link>
            <div className="text-sm text-muted-foreground hidden md:block border-l pl-4 ml-2">
              Your AI-powered ATS resume checker
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
