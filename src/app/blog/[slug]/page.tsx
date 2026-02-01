import { notFound } from 'next/navigation';
import { getPostBySlug, blogPosts } from '@/lib/blog-posts';
import { Header } from '@/components/resume-ace/header';
import { Metadata } from 'next';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | ResumeAce Blog`,
    description: post.description,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,42,241,0.15),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <article className="mx-auto max-w-3xl">
            <header className="mb-8 border-b pb-4">
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">Published on {post.date}</p>
            </header>
            <div
              className="space-y-6 text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>
    </div>
  );
}
