'use server';

import { extractEmailDetails, type ExtractEmailDetailsInput } from '@/ai/flows/extract-email-details';
import { getEmployees } from '@/services/email';
import { sendEmail } from '@/services/nodemailerService';

export interface ProcessVoiceCommandResult {
  success: boolean;
  message: string;
  sentTo?: { name: string; email: string; role: string, department: string }[];
  extractedRole?: string;
  extractedCoreMessage?: string;
  composedEmailBodyPreview?: string;
  promptValue?: string;
}

export interface SendManualEmailResult {
  success: boolean;
  message: string;
}

/**
 * Process a voice command and send emails to employees based on the extracted role.
 */
export async function processVoiceCommandAction(
  prevState: ProcessVoiceCommandResult | null,
  formData: FormData
): Promise<ProcessVoiceCommandResult> {
  const prompt = formData.get('prompt') as string;

  if (!prompt) {
    return { success: false, message: 'Prompt cannot be empty.', promptValue: prompt };
  }

  try {
    // Step 1: Extract details from voice prompt
    const aiInput: ExtractEmailDetailsInput = { voicePrompt: prompt };
    const extractedDetails = await extractEmailDetails(aiInput);

    if (!extractedDetails || !extractedDetails.role || !extractedDetails.coreMessage || !extractedDetails.emailBody) {
      return { 
        success: false, 
        message: 'AI could not extract role, core message, or compose email body from the prompt.',
        promptValue: prompt
      };
    }

    const { role: extractedRole, coreMessage: extractedCoreMessage, emailBody: composedEmailBody } = extractedDetails;

    // Step 2: Get all employees and filter by the role
    const employees = await getEmployees();
    const targetEmployees = employees.filter(emp => 
      emp.role.toLowerCase().includes(extractedRole.toLowerCase())
    );

    if (targetEmployees.length === 0) {
      return { 
        success: false, 
        message: `No employees found with the role: ${extractedRole}. Email not sent.`,
        extractedRole,
        extractedCoreMessage,
        composedEmailBodyPreview: composedEmailBody,
        promptValue: prompt
      };
    }

    // Step 3: Compose and send emails
    const emailSubject = `Action Required: ${extractedCoreMessage.substring(0, 50)}${extractedCoreMessage.length > 50 ? '...' : ''}`;
    const sentToDetails: ProcessVoiceCommandResult['sentTo'] = [];

    await Promise.all(targetEmployees.map(async (employee) => {
      await sendEmail(employee.email, emailSubject, composedEmailBody);
      sentToDetails.push({ name: employee.name, email: employee.email, role: employee.role, department: employee.department });
    }));

    const recipientNames = sentToDetails.map(s => `${s.name} (${s.role})`).join(', ');

    return { 
      success: true, 
      message: `Email successfully sent to: ${recipientNames}.`,
      sentTo: sentToDetails,
      extractedRole,
      extractedCoreMessage,
      composedEmailBodyPreview: composedEmailBody,
      promptValue: '' 
    };

  } catch (error) {
    console.error('Error processing prompt:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      success: false, 
      message: `An error occurred: ${errorMessage}`,
      promptValue: prompt
    };
  }
}

/**
 * Manually send an email to a specified recipient.
 */
export async function sendManualEmailAction(
  prevState: SendManualEmailResult | null,
  formData: FormData
): Promise<SendManualEmailResult> {
  const to = formData.get('to') as string;
  const subject = formData.get('subject') as string;
  const body = formData.get('body') as string;

  if (!to || !subject || !body) {
    return { success: false, message: 'To, Subject, and Body fields are required.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { success: false, message: 'Invalid recipient email address.' };
  }

  try {
    await sendEmail(to, subject, body);
    return { success: true, message: `Email successfully sent to ${to}.` };
  } catch (error) {
    console.error('Error sending manual email:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to send email: ${errorMessage}` };
  }
}
