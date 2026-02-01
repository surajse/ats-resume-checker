'use server';

import { improveResumeBulletPoints } from '@/ai/flows/improve-resume-bullet-points';
import type { ImproveResumeBulletPointsOutput } from '@/ai/flows/improve-resume-bullet-points';

interface ActionResult {
  improvedResumeText?: string;
  error?: string;
}

export async function getImprovedResume(
  resumeText: string,
  jobDescription: string
): Promise<ActionResult> {
  if (!resumeText) {
    return { error: 'Resume text is required.' };
  }

  try {
    const result: ImproveResumeBulletPointsOutput = await improveResumeBulletPoints({
      resumeText,
      jobDescription,
    });
    return { improvedResumeText: result.improvedResumeText };
  } catch (e) {
    console.error('Error improving resume:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to get suggestions. ${errorMessage}` };
  }
}
