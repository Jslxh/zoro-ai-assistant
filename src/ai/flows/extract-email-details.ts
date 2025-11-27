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

**CRITICAL INSTRUCTIONS**
First, you must perform a role classification task. This is the most important step.
1.  **Analyze the Voice Prompt:** Carefully read the user's command.
2.  **Think Step-by-Step:** Reason about the user's intent. For example, if the user says "devs" or "engineers", they mean "developer". If they mention "head of engineering", that corresponds to a "manager" role.
3.  **Select a Role:** You MUST choose one role from this exact list: ["manager", "developer", "sales", "marketing", "project manager", "finance", "all"].
4.  **Extract Core Message:** Create a concise summary for an email subject line.
5.  **Compose Email Body:** Write a complete, professional email. The body must be self-contained and ready to send. It must NOT include your reasoning or any other commentary.

---
**Example 1:**
*   **Voice Prompt:** "Ask the manager to submit the project files"
*   **Reasoning:** The prompt explicitly says "the manager". So the role is "manager".
*   **Output:**
    *   role: "manager"
    *   coreMessage: "submit project files"
    *   emailBody: "Dear Manager,\\n\\nI hope this email finds you well.\\n\\nThis email is to kindly request the submission of the project files at your earliest convenience.\\n\\nThank you for your attention to this matter.\\n\\nBest regards,\\nZoro Assistant"

---
**Example 2:**
*   **Voice Prompt:** "Tell all developers to update their SDKs, it's urgent"
*   **Reasoning:** The prompt says "all developers". The role is "developer".
*   **Output:**
    *   role: "developer"
    *   coreMessage: "urgent SDK update"
    *   emailBody: "Dear Developer,\\n\\nThis is an urgent notification regarding an important update.\\n\\nPlease update your SDKs as soon as possible. This is critical for maintaining system stability and security.\\n\\nThank you for your immediate attention to this urgent request.\\n\\nBest regards,\\nZoro Assistant"

---
**Example 3:**
*   **Voice Prompt:** "Ping the devs about the code freeze"
*   **Reasoning:** The term "devs" is a common synonym for "developers". The correct role is "developer".
*   **Output:**
    *   role: "developer"
    *   coreMessage: "code freeze reminder"
    *   emailBody: "Dear Developer,\\n\\nThis is a reminder about the upcoming code freeze.\\n\\nPlease ensure all your work is committed and merged before the deadline.\\n\\nBest regards,\\nZoro Assistant"

---
**Example 4:**
*   **Voice Prompt:** "A general announcement for all staff about the holiday party"
*   **Reasoning:** "All staff" means everyone. The correct role is "all".
*   **Output:**
    *   role: "all"
    *   coreMessage: "holiday party announcement"
    *   emailBody: "Dear Team,\\n\\nThis is an announcement regarding the upcoming company holiday party.\\n\\nMore details will be shared shortly. We look forward to celebrating with everyone!\\n\\nBest regards,\\nZoro Assistant"

---
**Example 5:**
*   **Voice Prompt:** "The head of engineering needs to see this."
*   **Reasoning:** "Head of engineering" is a leadership position, which falls under the "manager" category.
*   **Output:**
    *   role: "manager"
    *   coreMessage: "important information for review"
    *   emailBody: "Dear Manager,\\n\\nI hope this email finds you well.\\n\\nPlease review the attached information at your earliest convenience.\\n\\nBest regards,\\nZoro Assistant"

---
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
