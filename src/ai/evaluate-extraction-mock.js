// Lightweight mock evaluation runner (no AI calls, no Genkit)
const evaluationDataset = [
  { prompt: "Ask the manager to submit the project files", expectedRole: "manager" },
  { prompt: "Tell all developers to update their SDKs, it's urgent", expectedRole: "developer" },
  { prompt: "Remind the sales team about the weekly meeting", expectedRole: "sales" },
  { prompt: "Send the new marketing collateral to the marketing department", expectedRole: "marketing" },
  { prompt: "Can you ask the project manager for a status update?", expectedRole: "project manager" },
  { prompt: "Tell the finance team to process invoices", expectedRole: "finance" },
  { prompt: "A general announcement for all staff", expectedRole: "all" },
  { prompt: "Ping the devs about the code freeze", expectedRole: "developer" },
  { prompt: "Where is the sales report? Ask the sales lead.", expectedRole: "sales" },
  { prompt: "The head of engineering needs to see this.", expectedRole: "project manager" },
];

const LABELS = ["manager", "developer", "sales", "marketing", "project manager", "finance", "all"];

function mockExtractRole(prompt) {
  const p = prompt.toLowerCase();
  if (/devs|developers|engineer|code freeze|sdk/.test(p)) return 'developer';
  if (/manager|head of|project manager/.test(p)) return 'manager';
  if (/project manager/.test(p)) return 'project manager';
  if (/sales|sales lead|sales report/.test(p)) return 'sales';
  if (/marketing|collateral/.test(p)) return 'marketing';
  if (/finance|invoice|invoices/.test(p)) return 'finance';
  if (/all staff|everyone|all/.test(p)) return 'all';
  return 'other';
}

function calculateMetrics(predictions, groundTruths) {
  const allLabels = [...new Set([...LABELS, ...groundTruths, ...predictions])];
  const confusion = {};
  allLabels.forEach(t => { confusion[t] = {}; allLabels.forEach(p=> confusion[t][p]=0); });

  let correct = 0;
  for (let i=0;i<predictions.length;i++){
    const p = predictions[i]; const t = groundTruths[i];
    if (p===t) correct++;
    if (confusion[t] && confusion[t][p] !== undefined) confusion[t][p]++;
  }
  console.log(`\nAccuracy: ${(correct/groundTruths.length).toFixed(2)} (${correct}/${groundTruths.length})`);
  console.log('\nConfusion matrix:');
  console.table(confusion);
}

async function run() {
  console.log('Running mock evaluation...');
  const preds=[]; const truths=[];
  for (const item of evaluationDataset) {
    console.log('\nPrompt:', item.prompt);
    const pred = mockExtractRole(item.prompt);
    console.log('  - Ground truth:', item.expectedRole, ' Predicted:', pred);
    preds.push(pred);
    truths.push(item.expectedRole);
  }
  calculateMetrics(preds, truths);
}

run();
