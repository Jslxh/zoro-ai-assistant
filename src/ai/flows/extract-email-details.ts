'use server';

/**
 * @fileOverview
 * This module defines a Genkit flow to extract the role, a concise subject line,
 * and a fully composed, professional email body from a user's voice prompt,
 * intended for email automation purposes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema: describes the user's voice prompt
const ExtractEmailDetailsInputSchema = z.object({
  voicePrompt: z
    .string()
    .describe('User voice prompt, e.g., "Ask the manager to submit the project files".'),
});
export type ExtractEmailDetailsInput = z.infer<typeof ExtractEmailDetailsInputSchema>;

// Output schema: structured data extracted from the voice prompt
const ExtractEmailDetailsOutputSchema = z.object({
  role: z
    .string()
    .describe('Role of the employee to be contacted, e.g., "manager", "developer", "team lead".'),
  coreMessage: z
    .string()
    .describe('Concise summary of the task or instruction, suitable for an email subject line.'),
  emailBody: z
    .string()
    .describe('Polite, professionally worded email body formatted with newline characters.'),
});
export type ExtractEmailDetailsOutput = z.infer<typeof ExtractEmailDetailsOutputSchema>;

// Define the AI prompt to extract email details based on the voice prompt
const extractEmailDetailsPrompt = ai.definePrompt({
  name: 'extractEmailDetailsPrompt',
  input: { schema: ExtractEmailDetailsInputSchema },
  output: { schema: ExtractEmailDetailsOutputSchema },
  prompt: `
You are an AI assistant tasked with preparing professional emails based on user voice prompts.

Your tasks:
1. Identify the role of the employee to contact (e.g., "manager", "developer", "team lead").
2. Extract a concise summary of the core task or instruction (to be used as the email subject).
3. Compose a full, polite, and professionally worded email body **without any closing phrases like "Sincerely," "Best regards," or "Thank you."** Just the message content itself.
4. I don't "**Your prompt or any extra text related by the prompt."
5. Simply provide the email body content.
6. Format the email body with newline breaks for readability.

Voice Prompt: {{{voicePrompt}}}

Provide the extracted role, concise core message, and the composed email body in your response.
  `,
});


// Define the Genkit flow that calls the AI prompt
const extractEmailDetailsFlow = ai.defineFlow(
  {
    name: 'extractEmailDetailsFlow',
    inputSchema: ExtractEmailDetailsInputSchema,
    outputSchema: ExtractEmailDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await extractEmailDetailsPrompt(input);
    if (!output) {
      throw new Error('Failed to extract email details from voice prompt');
    }
    return output;
  }
);

/**
 * Exposed server-side function for frontend usage.
 * Processes the user's voice prompt and returns structured email details.
 */
export async function extractEmailDetails(
  input: ExtractEmailDetailsInput
): Promise<ExtractEmailDetailsOutput> {
  return await extractEmailDetailsFlow(input);
}
