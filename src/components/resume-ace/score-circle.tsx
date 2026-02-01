'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  className?: string;
}

export function ScoreCircle({ score, className }: ScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const animationDuration = 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
      setDisplayScore(Math.floor(progress * score));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [score]);
  
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorClasses =
    score < 50
      ? { text: 'text-destructive', stroke: 'stroke-destructive' }
      : score < 75
      ? { text: 'text-chart-4', stroke: 'stroke-chart-4' }
      : { text: 'text-chart-2', stroke: 'stroke-chart-2' };

  return (
    <div className={cn('relative h-36 w-36', className)}>
      <svg className="h-full w-full" viewBox="0 0 120 120">
        <circle
          className="stroke-secondary"
          strokeWidth="12"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={cn(
            'transition-[stroke-dashoffset] duration-1000 ease-out',
            colorClasses.stroke
          )}
          style={{ transitionProperty: 'stroke-dashoffset' }}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-4xl font-bold', colorClasses.text)}>
          {displayScore}
        </span>
        <p className="text-xs text-muted-foreground">/ 100</p>
      </div>
    </div>
  );
}
