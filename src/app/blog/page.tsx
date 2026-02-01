import Link from 'next/link';
import { blogPosts } from '@/lib/blog-posts';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/resume-ace/header';
import { ArrowRight } from 'lucide-react';

export default function BlogIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,42,241,0.15),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <section className="text-center mb-12">
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                ResumeAce Blog
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Tips, tricks, and insights to help you build a resume that beats the bots and wins interviews.
              </p>
            </section>

            <section className="space-y-8">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="bg-card/50 backdrop-blur-sm border border-border/20 shadow-lg hover:border-accent transition-all">
                  <CardHeader>
                    <Link href={`/blog/${post.slug}`}>
                      <CardTitle className="text-2xl font-bold hover:text-accent cursor-pointer">{post.title}</CardTitle>
                    </Link>
                    <CardDescription className="pt-2">{post.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                    <Link href={`/blog/${post.slug}`} passHref>
                      <Button variant="link" className="p-0 h-auto">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
