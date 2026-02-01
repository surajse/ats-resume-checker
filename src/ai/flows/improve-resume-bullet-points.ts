'use server';

/**
 * @fileOverview A resume bullet point improvement AI agent.
 *
 * - improveResumeBulletPoints - A function that suggests improvements to resume bullet points.
 * - ImproveResumeBulletPointsInput - The input type for the improveResumeBulletPoints function.
 * - ImproveResumeBulletPointsOutput - The return type for the improveResumeBulletPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveResumeBulletPointsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text of the resume to improve bullet points in.'),
  jobDescription: z.string().optional().describe('The job description to tailor the bullet points to.'),
});
export type ImproveResumeBulletPointsInput = z.infer<
  typeof ImproveResumeBulletPointsInputSchema
>;

const ImproveResumeBulletPointsOutputSchema = z.object({
  improvedResumeText: z
    .string()
    .describe('The resume text with improved bullet points.'),
});
export type ImproveResumeBulletPointsOutput = z.infer<
  typeof ImproveResumeBulletPointsOutputSchema
>;

export async function improveResumeBulletPoints(
  input: ImproveResumeBulletPointsInput
): Promise<ImproveResumeBulletPointsOutput> {
  return improveResumeBulletPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveResumeBulletPointsPrompt',
  input: {schema: ImproveResumeBulletPointsInputSchema},
  output: {schema: ImproveResumeBulletPointsOutputSchema},
  prompt: `You are an expert resume writer specializing in improving bullet points to be more appealing to potential employers.

You will be provided with the text of a resume, and you will identify the bullet points and rewrite them to be more action-oriented and highlight the skills and impact of the candidate.

If a job description is provided, tailor the bullet points to match the requirements of the job description.

Resume:
{{{resumeText}}}

Job Description (Optional):
{{{jobDescription}}}

Improved Resume:
`,
});

const improveResumeBulletPointsFlow = ai.defineFlow(
  {
    name: 'improveResumeBulletPointsFlow',
    inputSchema: ImproveResumeBulletPointsInputSchema,
    outputSchema: ImproveResumeBulletPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
