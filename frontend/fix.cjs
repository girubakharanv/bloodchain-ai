const fs = require('fs');

let f1 = 'src/pages/DecisionDNA/data/decisionDnaDemo.ts';
let d1 = fs.readFileSync(f1, 'utf8');
d1 = d1.replace(/direction: 'UP'/g, "direction: 'UP',\n    classification: 'PRIMARY DRIVER'");
d1 = d1.replace(/direction: 'DOWN'/g, "direction: 'DOWN',\n    classification: 'OPPOSING CONSTRAINT'");
d1 = d1.replace(/direction: 'NEUTRAL'/g, "direction: 'NEUTRAL',\n    classification: 'NEUTRAL'");
fs.writeFileSync(f1, d1);

let f2 = 'src/pages/DecisionDNA/utils/decisionDnaEngine.ts';
let d2 = fs.readFileSync(f2, 'utf8');
d2 = d2.replace(/impactLevel: string;/g, "impactLevel: ImpactLevel;");
d2 = d2.replace(/classification: DriverClassification;/g, "classification: DriverClassification;");
d2 = d2.replace(/direction: string;/g, "direction: 'UP' | 'DOWN' | 'NEUTRAL';");
fs.writeFileSync(f2, d2);
