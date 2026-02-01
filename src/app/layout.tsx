import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'ATS Resume Checker – Free Resume Score & Optimization | ResumeAce',
  description: 'Check your resume ATS score instantly. ResumeAce analyzes ATS parsing, keywords, sections, and resume quality — 100% free & private.',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "ResumeAce",
      "url": "https://resumeace.in/"
    },
    {
      "@type": "WebApplication",
      "name": "ATS Resume Checker",
      "url": "https://resumeace.in/",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Check your resume ATS score instantly. ResumeAce analyzes ATS parsing, keywords, sections, and resume quality — 100% free & private."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an ATS resume checker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An ATS resume checker is a tool that simulates how Applicant Tracking Systems (ATS) parse and rank resumes. It helps you optimize your resume to pass these automated screening systems and reach a human recruiter."
          }
        },
        {
          "@type": "Question",
          "name": "Is ResumeAce free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our basic ATS analysis, which includes your overall score and a breakdown of checks, is completely free. We offer premium features for more advanced suggestions and optimizations."
          }
        },
        {
          "@type": "Question",
          "name": "Can ATS read PDF resumes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, modern ATS can read text-based PDF files effectively. However, it's crucial to avoid complex formatting, images, and tables, as these can still cause parsing issues. Our checker verifies if your PDF is readable."
          }
        },
        {
            "@type": "Question",
            "name": "What is a good ATS score?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "A score above 80 is generally considered strong, indicating good ATS compatibility. Scores between 60-79 suggest areas for improvement, while scores below 60 have a high risk of being filtered out."
            }
        },
        {
          "@type": "Question",
          "name": "Is my resume stored?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Your resume is processed in your browser and is never uploaded to our servers or stored, unless you choose to log in to save your history. Your privacy is guaranteed."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
