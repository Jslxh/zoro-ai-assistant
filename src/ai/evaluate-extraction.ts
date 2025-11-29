
import { config } from 'dotenv';
config();

import { extractEmailDetails } from './flows/extract-email-details.ts';

// This is our "ground truth" test dataset.
const evaluationDataset = [
  { prompt: "Ask the manager to submit the project files", expectedRole: "manager" },
  { prompt: "Tell all developers to update their SDKs, it's urgent", expectedRole: "developer" },
  { prompt: "Remind the sales team about the weekly meeting", expectedRole: "sales" },
  { prompt: "Send the new marketing collateral to the marketing department", expectedRole: "marketing" },
  { prompt: "Can you ask the project manager for a status update?", expectedRole: "project manager" },
  { prompt: "Tell the finance team to process invoices", expectedRole: "finance" },
  { prompt: "A general announcement for all staff", expectedRole: "all" }, // Assuming 'all' is a possible role
  { prompt: "Ping the devs about the code freeze", expectedRole: "developer" },
  { prompt: "Where is the sales report? Ask the sales lead.", expectedRole: "sales" },
  { prompt: "The head of engineering needs to see this.", expectedRole: "project manager" }, // Example of a synonym
];

// To keep it simple, we'll define our possible roles (classes) here.
const LABELS = ["manager", "developer", "sales", "marketing", "project manager", "finance", "all"];

async function runEvaluation() {
  console.log("Starting evaluation of role extraction...");

  const predictions: string[] = [];
  const groundTruths: string[] = [];

  for (const item of evaluationDataset) {
    console.log(`\nProcessing prompt: "${item.prompt}"`);
    try {
      const result = await extractEmailDetails({ voicePrompt: item.prompt });
      const predictedRole = result.role.toLowerCase();
      console.log(`  - Ground Truth: "${item.expectedRole}"`);
      console.log(`  - Predicted:    "${predictedRole}"`);

      // Normalize predictions to fit our labels
      const normalizedPrediction = LABELS.includes(predictedRole) ? predictedRole : "other";

      predictions.push(normalizedPrediction);
      groundTruths.push(item.expectedRole);
    } catch (error) {
      console.error(`  - Error processing prompt:`, error);
      predictions.push("error"); // Mark errors
      groundTruths.push(item.expectedRole);
    }
  }

  console.log("\n\n--- Evaluation Results ---");
  calculateMetrics(predictions, groundTruths);
}

function calculateMetrics(predictions: string[], groundTruths: string[]) {
  const allLabels = [...new Set([...LABELS, ...groundTruths, ...predictions])];
  const confusionMatrix: { [key: string]: { [key: string]: number } } = {};

  // Initialize confusion matrix
  for (const trueLabel of allLabels) {
    confusionMatrix[trueLabel] = {};
    for (const predLabel of allLabels) {
      confusionMatrix[trueLabel][predLabel] = 0;
    }
  }

  let correctPredictions = 0;
  for (let i = 0; i < predictions.length; i++) {
    const pred = predictions[i];
    const truth = groundTruths[i];
    if (pred === truth) {
      correctPredictions++;
    }
    if (confusionMatrix[truth] && confusionMatrix[truth][pred] !== undefined) {
      confusionMatrix[truth][pred]++;
    }
  }

  // --- 1. Accuracy ---
  const accuracy = correctPredictions / groundTruths.length;
  console.log(`\nAccuracy: ${accuracy.toFixed(2)} (${correctPredictions}/${groundTruths.length} correct)`);

  // --- 2. Confusion Matrix ---
  console.log("\nConfusion Matrix:");
  // Header
  let header = " ".padEnd(16);
  allLabels.forEach(label => header += label.substring(0, 5).padEnd(6));
  console.log(header);
  console.log("-".repeat(header.length));
  // Rows
  for (const trueLabel of allLabels) {
    if (groundTruths.includes(trueLabel)) {
      let row = `True ${trueLabel}`.padEnd(15) + "|";
      for (const predLabel of allLabels) {
        row += `${confusionMatrix[trueLabel][predLabel]}`.padEnd(6);
      }
      console.log(row);
    }
  }
  
  // --- 3. F1-Score (Macro Average) ---
  let totalF1 = 0;
  let includedLabels = 0;
  console.log("\nPer-Class F1-Scores:");
  for (const label of allLabels) {
    if (!groundTruths.includes(label)) continue;

    const TP = confusionMatrix[label][label] || 0;
    const FP = Object.keys(confusionMatrix).reduce((sum, key) => sum + (key !== label ? confusionMatrix[key][label] || 0 : 0), 0);
    const FN = Object.keys(confusionMatrix[label]).reduce((sum, key) => sum + (key !== label ? confusionMatrix[label][key] || 0 : 0), 0);
    
    const precision = TP / (TP + FP) || 0;
    const recall = TP / (TP + FN) || 0;
    const f1 = 2 * (precision * recall) / (precision + recall) || 0;

    console.log(`  - ${label.padEnd(15)}: ${f1.toFixed(2)}`);
    totalF1 += f1;
    includedLabels++;
  }

  const macroF1 = totalF1 / includedLabels;
  console.log(`\nMacro F1-Score: ${macroF1.toFixed(2)}`);
}


runEvaluation();
