import fs from 'fs';

let content = fs.readFileSync('src/data/cases.ts', 'utf8');

// Add red herring to fatigue case
content = content.replace(
  "id: 'ev2', name: 'Vibration Logs', category: 'sensor', cost: 10, redHerring: false, supportsCauseIds: ['fatigue']",
  "id: 'ev2', name: 'Vibration Logs', category: 'sensor', cost: 10, redHerring: false, supportsCauseIds: ['fatigue']" // wait, let's keep ev2 as correct, add ev3
);

let ev3 = `      },
      {
        id: 'ev3', name: 'Operator Interview', category: 'interview', cost: 5, redHerring: true, supportsCauseIds: ['overload'], redHerringExplanation: 'The operator speculated about a massive power surge, but load logs show normal current. It tests if you believe hearsay over physical evidence.', shortSummary: 'Operator statement on the incident.',
        interviewData: { witnessRole: 'Shift Supervisor', quote: 'I heard a massive bang and the motor pulled triple amps! Must have been a huge overload from the grid!', reliability: 'Low' }
      }`;

content = content.replace(
  "unit: 'mm/s', description: 'Stable vibration, slight increase.', dataPoints: [{time: 'M1', value: 1.8}, {time: 'Fail', value: 2.4}] }\n      }\n    ]\n  },",
  "unit: 'mm/s', description: 'Stable vibration, slight increase.', dataPoints: [{time: 'M1', value: 1.8}, {time: 'Fail', value: 2.4}] }\n" + ev3 + "\n    ]\n  },"
);

let arm_ev2 = `      },
      {
        id: 'ev2', name: 'Maintenance Log', category: 'document', cost: 5, redHerring: true, supportsCauseIds: ['fatigue'], redHerringExplanation: 'The maintenance log shows a missed lubrication cycle, suggesting wear/fatigue, but the clean, rapid overload fracture surface proves otherwise.', shortSummary: 'Recent maintenance records.',
        witnessData: { witnessName: 'Tech', role: 'Maintenance', statement: 'We missed the last lubrication cycle on that elbow joint because the line was running 24/7.' }
      }`;

content = content.replace(
  "annotations: [{x: 50, y: 50, label: 'Rough fracture surface'}] }\n      }\n    ]\n  }",
  "annotations: [{x: 50, y: 50, label: 'Rough fracture surface'}] }\n" + arm_ev2 + "\n    ]\n  }"
);

fs.writeFileSync('src/data/cases.ts', content);
