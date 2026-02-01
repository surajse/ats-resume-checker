'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Lock, UploadCloud, FileCheck, AlertCircle, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Required for pdf.js to work
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ResumeUploadProps {
  onTextExtracted: (text: string, file: File) => void;
  resetAnalysis: () => void;
}

export function ResumeUpload({ onTextExtracted, resetAnalysis }: ResumeUploadProps) {
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const extractText = async (file: File) => {
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => ('str' in item ? item.str : '')).join(' ');
        }
        return text;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }
      return '';
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new Error('Could not read text from file.');
    }
  };

  const handleReset = () => {
    setFileName('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    resetAnalysis();
  }

  const validateFile = useCallback(async (file: File | null) => {
    handleReset();
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("❌ Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrorMsg("❌ File size must be under 2MB.");
      return;
    }


    try {
      const text = await extractText(file);
      if (!text.trim()) {
        setErrorMsg("Could not extract text. Please ensure it's a text-based file.");
        return;
      }
      onTextExtracted(text, file);
      setFileName(file.name);
      toast({
        title: '✅ Resume Loaded',
        description: 'Your resume is ready for analysis.',
      });
    } catch (error) {
      setErrorMsg("An error occurred while processing your file.");
      console.error(error);
    }
  }, [onTextExtracted, toast, resetAnalysis]);


  const handleButtonClick = () => {
    if (fileName) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileName) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileName) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="flex justify-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 w-full max-w-2xl text-center transition-colors relative",
          isDragging ? 'border-accent bg-accent/10' : 'border-border',
          !fileName && 'hover:border-accent cursor-pointer',
          fileName && 'border-accent bg-accent/10'
        )}
        onClick={handleButtonClick}
      >
        {fileName ? (
          <>
            <div className="flex items-center justify-center gap-2 text-chart-2 font-semibold">
              <FileCheck className="h-6 w-6" /> 
              <span className="text-lg">{fileName}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Ready for analysis!</p>
             <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              >
                <X className="h-4 w-4" />
             </Button>
          </>
        ) : (
          <>
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-base text-foreground mb-2 leading-relaxed">
              Drop your resume here or click to upload. <br />
              <strong className="font-semibold text-primary">PDF & DOCX only.</strong> Max 2MB file size.
            </p>
            <Button id="uploadBtn" variant="ghost" className="pointer-events-none mb-4">
                Upload Your Resume
            </Button>
          </>
        )}


        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          accept=".pdf,.docx"
          hidden
          onChange={handleFileChange}
        />
        
        {!fileName && (
          <p className="mt-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" /> Privacy guaranteed – files never uploaded to server
          </p>
        )}

        {errorMsg && (
          <p className="mt-2.5 text-destructive text-sm flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" /> {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
