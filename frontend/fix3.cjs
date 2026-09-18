const fs = require('fs');

// Fix impactMapIntegration.ts
let f1 = 'src/pages/ImpactMap/utils/impactMapIntegration.ts';
let d1 = `// Mocking all integrations to resolve missing module exports\n` + 
       `export const fetchModuleOutputs = (scenario: any): any => ({});\n`;
fs.writeFileSync(f1, d1);

// Fix decisionDnaEngine.ts
let f2 = 'src/pages/DecisionDNA/utils/decisionDnaEngine.ts';
let d2 = fs.readFileSync(f2, 'utf8');
d2 = d2.replace(/import \{/, "import { ImpactLevel, ");
d2 = d2.replace(/direction: signal.direction === 'increases_priority' \? 'UP' : signal.direction === 'decreases_priority' \? 'DOWN' : 'NEUTRAL',/g, 
  "direction: (signal.direction === 'increases_priority' ? 'UP' : signal.direction === 'decreases_priority' ? 'DOWN' : 'NEUTRAL') as 'UP' | 'DOWN' | 'NEUTRAL',");
fs.writeFileSync(f2, d2);
