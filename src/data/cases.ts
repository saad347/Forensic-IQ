import { Case, EvidenceCard, CaseDifficulty } from '../types';

export const TAXONOMY_CAUSES = [
  { id: 'fatigue', name: 'High-Cycle Mechanical Fatigue', description: 'Failure after millions of cycles typically initiating at a stress concentration.' },
  { id: 'brittle', name: 'Brittle Fracture', description: 'Sudden, rapid crack propagation with little to no plastic deformation.' },
  { id: 'ductile', name: 'Tensile Ductile Overload', description: 'Catastrophic failure when applied tensile stress exceeds ultimate tensile strength.' },
  { id: 'scc', name: 'Stress Corrosion Cracking', description: 'Environmentally assisted cracking due to tensile stress and corrosive medium.' },
  { id: 'abrasive', name: 'Severe Abrasive Wear', description: 'Material removal from sliding action of harder particles.' },
  { id: 'creep', name: 'High-Temperature Creep Rupture', description: 'Progressive plastic deformation of material under stress at high temperatures.' },
  { id: 'thermal_fatigue', name: 'Thermal Fatigue', description: 'Failure from cyclic stresses caused by thermal expansion and contraction.' },
  { id: 'cavitation', name: 'Pump Cavitation', description: 'Formation and implosion of vapor bubbles causing shockwaves and pitting.' },
  { id: 'water_hammer', name: 'Water Hammer (Hydraulic Shock)', description: 'Pressure surge when a fluid in motion is forced to stop or change direction suddenly.' },
  { id: 'hvac_slug', name: 'Compressor Liquid Slug', description: 'Catastrophic damage to compressor internals caused by attempting to compress liquid refrigerant.' },
  { id: 'fretting', name: 'Fretting Fatigue', description: 'Fatigue damage induced by minute relative oscillations between pressed-fit components.' },
  { id: 'overload', name: 'Mechanical Overload', description: 'Instantaneous structural failure when a component is subjected to a load exceeding its yield strength without safeties.' }
];

const BASE_CASES: Partial<Case>[] = [
  {
    id: 'base_fatigue',
    title: 'Drive Shaft Fracture',
    system: 'Main Reciprocating Drive Assembly',
    field: 'Structural',
    majorCaseType: 'Aerospace & Aviation',
    difficulty: 'Beginner',
    ambiguity: 2,
    redHerringDensity: 2,
    shortDescription: 'A massive drive shaft fractured suddenly after continuous service, halting production.',
    briefing: '<p>A heavy-duty drive shaft fractured catastrophically during standard operation. There were no prior warning indicators on the operator panel.</p><p>Identify the failure mechanism and root cause.</p>',
    startingBudget: 100,
    correctCauseId: 'fatigue',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'NTSB Aviation Investigation Report on Fatigue',
    resourceLink: 'https://www.ntsb.gov/investigations/AccidentReports/Reports/AAR1801.pdf',
    resourceTitle: 'NTSB: Aircraft Component Fatigue Failure',
    causalChain: 'High-Cycle Mechanical Fatigue due to an improper sharp fillet radius machined during maintenance.',
    hintPool: ['Examine the fillet radius.', 'Check maintenance logs for machining.', 'Look for beach marks.'],
    evidence: [
      {
        id: 'ev1', name: 'Fractograph', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Macro-photograph of shaft surface.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1590846127263-95c52c035fdd?q=80&w=800&auto=format&fit=crop', description: 'Stereo microscope view. Initiation at sharp fillet, showing concentric beach marks.', hasZoom: true, zoomDetails: 'SEM shows micro-striations.', annotations: [{x: 50, y: 30, label: 'Beach marks evident'}] }
      },
      {
        id: 'ev2', name: 'Vibration Logs', category: 'sensor', cost: 10, redHerring: false, shortSummary: 'Sensor telemetry.',
        sensorData: { chartTitle: 'Vibration', xAxisLabel: 'Months', yAxisLabel: 'Velocity', unit: 'mm/s', description: 'Stable vibration, slight increase.', dataPoints: [{time: 'M1', value: 1.8}, {time: 'Fail', value: 2.4}] }
      }
    ]
  },
  {
    id: 'base_brittle',
    title: 'Cryogenic Flange Bolt Fracture',
    system: 'Main Cryogenic Flange Joint',
    field: 'Structural',
    majorCaseType: 'Marine & Offshore',
    difficulty: 'Intermediate',
    ambiguity: 3,
    redHerringDensity: 2,
    shortDescription: 'A safety joint flange bolt fractured with extreme force releasing high-pressure cryo-vapor.',
    briefing: '<p>An acoustic sensor triggered a gas leak alarm. A critical flange joint failed in freezing weather.</p>',
    startingBudget: 110,
    correctCauseId: 'brittle',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'NIST Brittle Fracture Report',
    resourceLink: 'https://nvlpubs.nist.gov/nistpubs/jres/047/jresv47n3p206_A1b.pdf',
    resourceTitle: 'NIST: Brittle Fracture in Steel Structures',
    causalChain: 'Incorrect carbon steel bolts were installed, causing brittle fracture below DBTT.',
    hintPool: ['Check alloy specs.', 'Examine SEM for cleavage.', 'Note DBTT temperatures.'],
    evidence: [
      {
        id: 'ev1', name: 'SEM Bolt', category: 'visual', cost: 20, redHerring: false, shortSummary: 'Micrograph of cracked bolt.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54ecec81?q=80&w=800&auto=format&fit=crop', description: 'Cleavage facets and river marks, zero plastic necking.', hasZoom: true, zoomDetails: 'River marks evident.', annotations: [{x: 40, y: 60, label: 'Cleavage facet'}] }
      }
    ]
  },
  {
    id: 'base_ductile',
    title: 'Superheater Boiler Tube Rupture',
    system: 'Power Station Superheater Section',
    field: 'Structural',
    majorCaseType: 'Energy & Power Systems',
    difficulty: 'Beginner',
    ambiguity: 2,
    redHerringDensity: 1,
    shortDescription: 'A boiler tube burst with an explosive blast showing a fish-mouth profile.',
    briefing: '<p>A sudden drop in steam pressure. A boiler tube burst venting high-pressure steam.</p>',
    startingBudget: 100,
    correctCauseId: 'ductile',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'CSB Boiler Explosion Report',
    resourceLink: 'https://www.csb.gov/assets/1/20/csb_final_report_boiler_explosion.pdf',
    resourceTitle: 'CSB: Boiler Explosion Investigation Report',
    causalChain: 'Safety valve stuck, causing extreme pressure spike leading to ductile over-stress burst.',
    hintPool: ['Look for fish-mouth opening.', 'Check pressure telemetry.'],
    evidence: [
      {
        id: 'ev1', name: 'Visual Burst', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Boiler tube burst profile.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1504913659239-6abc87875a63?q=80&w=800&auto=format&fit=crop', description: 'Fish-mouth rupture, thin knife-like lips.', hasZoom: true, zoomDetails: 'Dimpled structure.', annotations: [{x: 60, y: 50, label: 'Thinning / Necking'}] }
      }
    ]
  },
  {
    id: 'base_scc',
    title: 'Petrochemical Reactor Pipe Crack',
    system: 'Acidic Process Fluid Recirculation',
    field: 'Structural',
    majorCaseType: 'Chemical Processing',
    difficulty: 'Advanced',
    ambiguity: 4,
    redHerringDensity: 2,
    shortDescription: 'A stainless steel weld joint cracked, causing a major chemical leak.',
    briefing: '<p>A pinhole leak erupted near a weld joint on a 316L SS line carrying hot fluid.</p>',
    startingBudget: 100,
    correctCauseId: 'scc',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'OSHA Safety Information Bulletin',
    resourceLink: 'https://www.osha.gov/publications/shib072607',
    resourceTitle: 'OSHA: Stress Corrosion Cracking in Stainless Steel',
    causalChain: 'Skipped stress-relief combined with chloride spike caused transgranular SCC.',
    hintPool: ['Look for branched cracking.', 'Check PWHT logs.', 'Check chlorides.'],
    evidence: [
      {
        id: 'ev1', name: 'Micrograph', category: 'visual', cost: 20, redHerring: false, shortSummary: 'Crack cross-section.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?q=80&w=800&auto=format&fit=crop', description: 'Highly branched transgranular cracking.', hasZoom: true, zoomDetails: 'Typical SCC structure.', annotations: [{x: 20, y: 70, label: 'Branched cracks'}] }
      }
    ]
  },
  {
    id: 'base_abrasive',
    title: 'Conveyor Gearbox Teeth Wear',
    system: 'Primary Ore Crusher Gearbox',
    field: 'Mechanical',
    majorCaseType: 'Material Handling & Mining',
    difficulty: 'Beginner',
    ambiguity: 1,
    redHerringDensity: 2,
    shortDescription: 'Gearbox teeth wore flat in under 3 months.',
    briefing: '<p>A heavy-duty conveyor belt slipped. Gear teeth were completely ground down.</p>',
    startingBudget: 100,
    correctCauseId: 'abrasive',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'NREL Gearbox Reliability Report',
    resourceLink: 'https://www.nrel.gov/docs/fy14osti/61461.pdf',
    resourceTitle: 'NREL: Gearbox Reliability Investigation',
    causalChain: 'Dust intrusion from torn seal mixed with oil forming grinding paste.',
    hintPool: ['Look for gouges.', 'Check oil silicon levels.', 'Review seal inspection.'],
    evidence: [
      {
        id: 'ev1', name: 'Wear Flank', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Gear teeth close-up.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1606322971216-3e79dbcc0699?q=80&w=800&auto=format&fit=crop', description: 'Deep gouges and micro-ploughing tracks.', hasZoom: true, zoomDetails: 'Silica grains embedded.', annotations: [{x: 40, y: 40, label: 'Gouging marks'}] }
      }
    ]
  },
  {
    id: 'base_creep',
    title: 'Steam Turbine Blade Stretched',
    system: 'Supercritical Steam Turbine',
    field: 'Thermo',
    majorCaseType: 'Gas Turbines & Propulsion',
    difficulty: 'Advanced',
    ambiguity: 4,
    redHerringDensity: 3,
    shortDescription: 'Turbine blades deformed radially at high speed.',
    briefing: '<p>Stage 2 experienced high vibration. Blades showed severe radial stretching.</p>',
    startingBudget: 120,
    correctCauseId: 'creep',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'DOE Creep Rupture Fundamentals',
    resourceLink: 'https://www.energy.gov/sites/prod/files/2014/03/f13/creep_rupture_0.pdf',
    resourceTitle: 'DOE: Creep Rupture Fundamentals',
    causalChain: 'Valve leak caused over-temp, accelerating creep cavitation.',
    hintPool: ['Look for grain boundary voids.', 'Check temp logs.', 'Review alloy specs.'],
    evidence: [
      {
        id: 'ev1', name: 'Microstructure', category: 'visual', cost: 20, redHerring: false, shortSummary: 'Blade cross-section.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1518773926880-60b64d39e236?q=80&w=800&auto=format&fit=crop', description: 'Microscopic spherical cavities along transverse grain boundaries.', hasZoom: true, zoomDetails: 'Creep voids.', annotations: [{x: 70, y: 70, label: 'Microvoids at boundary'}] }
      }
    ]
  },
  {
    id: 'base_thermal_fatigue',
    title: 'Heat Exchanger Tube Plate Crack',
    system: 'Refinery Heat Exchanger Array',
    field: 'Thermo',
    majorCaseType: 'Heavy Manufacturing',
    difficulty: 'Intermediate',
    ambiguity: 3,
    redHerringDensity: 1,
    shortDescription: 'Tube sheet cracks due to rapid temperature cycling.',
    briefing: '<p>Multiple ligaments cracked between tube holes on a massive heat exchanger tube plate.</p>',
    startingBudget: 100,
    correctCauseId: 'thermal_fatigue',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'EPRI Thermal Fatigue Guide',
    resourceLink: 'https://www.epri.com/research/products/1012759',
    resourceTitle: 'EPRI: Thermal Fatigue Management Guideline',
    causalChain: 'Aggressive operational thermal cycling caused expanding/contracting cyclic stresses.',
    hintPool: ['Look at cyclic temp logs.', 'Review tube sheet geometry.', 'Check for multiple initiation sites (craze cracking).'],
    evidence: [
      {
        id: 'ev1', name: 'Visual Sheet', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Tube sheet cracks.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop', description: 'Network of craze cracking (checkerboard pattern) on the surface.', hasZoom: true, zoomDetails: 'Transgranular cracks filled with oxide spikes.', annotations: [{x: 30, y: 40, label: 'Craze cracking'}] }
      }
    ]
  },
  {
    id: 'base_cavitation',
    title: 'Centrifugal Pump Impeller Pitting',
    system: 'Main Cooling Water Intake Pump',
    field: 'Fluid',
    majorCaseType: 'Fluid Dynamics & Hydraulics',
    difficulty: 'Intermediate',
    ambiguity: 2,
    redHerringDensity: 2,
    shortDescription: 'Pump impeller rapidly deteriorated with sponge-like pitting.',
    briefing: '<p>A 2000 GPM pump lost efficiency and vibration spiked. The bronze impeller looks like a sponge.</p>',
    startingBudget: 100,
    correctCauseId: 'cavitation',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'DOE Pump Performance Guide',
    resourceLink: 'https://www.energy.gov/eere/amo/downloads/improving-pumping-system-performance',
    resourceTitle: 'DOE: Improving Pumping System Performance',
    causalChain: 'Inlet strainer blockage caused low NPSH-A, leading to fluid vaporization and cavitation pitting.',
    hintPool: ['Check inlet pressure logs.', 'Look for spongy pitting.', 'Calculate NPSH.'],
    evidence: [
      {
        id: 'ev1', name: 'Impeller Macro', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Impeller trailing edge.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1582298642735-86643efb8e23?q=80&w=800&auto=format&fit=crop', description: 'Deep, irregular, spongy pitting craters with no rust or corrosion products.', hasZoom: true, zoomDetails: 'Micro-jet impact deformation.', annotations: [{x: 50, y: 50, label: 'Spongy craters'}] }
      }
    ]
  },
  {
    id: 'base_water_hammer',
    title: 'Cooling Tower Pipe Blowout',
    system: 'Cooling Water Circulation Network',
    field: 'Fluid',
    majorCaseType: 'Civil & Water Infrastructure',
    difficulty: 'Beginner',
    ambiguity: 2,
    redHerringDensity: 1,
    shortDescription: 'A 24-inch PVC elbow blew apart after a pump trip.',
    briefing: '<p>Immediately following a power outage and pump trip, a large cooling line elbow blew out catastrophically.</p>',
    startingBudget: 100,
    correctCauseId: 'water_hammer',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'NRC Water Hammer Prevention',
    resourceLink: 'https://www.nrc.gov/docs/ML1221/ML12216A192.pdf',
    resourceTitle: 'NRC: Water Hammer Prevention and Mitigation',
    causalChain: 'Sudden pump trip without surge arrestors caused massive hydraulic shockwave reflection.',
    hintPool: ['Check valve closing times or pump trips.', 'Look at transient pressure logs.'],
    evidence: [
      {
        id: 'ev1', name: 'Elongated Tear', category: 'visual', cost: 15, redHerring: false, shortSummary: 'PVC elbow fragments.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1591550921473-b3cda789b788?q=80&w=800&auto=format&fit=crop', description: 'Massive longitudinal splitting of the pipe.', hasZoom: true, zoomDetails: 'No prior degradation.', annotations: [{x: 60, y: 40, label: 'Longitudinal split'}] }
      }
    ]
  },
  {
    id: 'base_hvac_slug',
    title: 'Chiller Compressor Scroll Shatter',
    system: 'Industrial HVAC Chiller Plant',
    field: 'HVAC',
    majorCaseType: 'HVAC & Environmental Control',
    difficulty: 'Advanced',
    ambiguity: 3,
    redHerringDensity: 2,
    shortDescription: 'Scroll compressor internals shattered on cold start.',
    briefing: '<p>A 50-ton scroll chiller compressor made a loud bang and locked up upon morning startup.</p>',
    startingBudget: 110,
    correctCauseId: 'hvac_slug',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'ORNL Compressor Reliability',
    resourceLink: 'https://info.ornl.gov/sites/publications/files/Pub53856.pdf',
    resourceTitle: 'ORNL: Heat Pump Compressor Reliability',
    causalChain: 'Failed crankcase heater allowed liquid refrigerant to migrate to compressor shell. Startup tried to compress incompressible liquid, shattering scrolls.',
    hintPool: ['Look at ambient temp during offline hours.', 'Check heater logs.', 'Look at the shattered scroll plates.'],
    evidence: [
      {
        id: 'ev1', name: 'Shattered Scroll', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Internal scroll plates.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1616881720845-e461b2ed0c39?q=80&w=800&auto=format&fit=crop', description: 'Heavy cast-iron scroll plates broken into multiple large, clean chunks.', hasZoom: true, zoomDetails: 'Massive overload fracture surfaces.', annotations: [{x: 45, y: 55, label: 'Overload chunk'}] }
      }
    ]
  },
  {
    id: 'base_rail_axle',
    title: 'High-Speed Rail Axle Failure',
    system: 'Train Bogie Wheel Assembly',
    field: 'Structural',
    majorCaseType: 'Automotive & Rail',
    difficulty: 'Intermediate',
    ambiguity: 3,
    redHerringDensity: 2,
    shortDescription: 'Train axle fractured causing a high-speed derailment.',
    briefing: '<p>A train derailed at 150 km/h due to a complete severing of a solid steel wheel axle.</p>',
    startingBudget: 100,
    correctCauseId: 'fretting',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'NTSB Railroad Accident Report',
    resourceLink: 'https://www.ntsb.gov/investigations/AccidentReports/Reports/RAR2001.pdf',
    resourceTitle: 'NTSB: Railroad Accident Report - Axle Failure',
    causalChain: 'Fretting fatigue initiated under the press-fitted wheel bearing due to micro-slip.',
    hintPool: ['Look closely under the bearing seat.', 'Check for reddish-brown oxide powder.', 'Search for initiation marks.'],
    evidence: [
      {
        id: 'ev1', name: 'Bearing Seat Scan', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Axle surface at fracture.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=800&auto=format&fit=crop', description: 'Presence of reddish-brown "cocoa" powder and semi-circular crack initiation beneath the press-fit region.', hasZoom: true, zoomDetails: 'Fretting wear scars with microcracks.', annotations: [{x: 35, y: 50, label: 'Cocoa oxide powder'}] }
      }
    ]
  },
  {
    id: 'base_robot_arm',
    title: 'Industrial Robot Arm Collapse',
    system: 'Automotive Assembly Robot',
    field: 'Structural',
    majorCaseType: 'Robotics & Automation',
    difficulty: 'Beginner',
    ambiguity: 1,
    redHerringDensity: 1,
    shortDescription: 'A heavy payload robotic arm snapped at the primary elbow joint.',
    briefing: '<p>A 6-axis welding robot collapsed onto the assembly line when picking up a heavy chassis frame.</p>',
    startingBudget: 90,
    correctCauseId: 'overload',
    taxonomyCauses: TAXONOMY_CAUSES,
    citation: 'OSHA Robotics Safety Guidelines',
    resourceLink: 'https://www.osha.gov/publications/robotic-safety',
    resourceTitle: 'OSHA: Robotics and Automation Safety',
    causalChain: 'Overload failure of cast aluminum linkage due to a bypassed payload safety limit switch.',
    hintPool: ['Check payload weight vs specs.', 'Look at limit switch logs.', 'Examine fracture surface for rapid failure.'],
    evidence: [
      {
        id: 'ev1', name: 'Arm Linkage Break', category: 'visual', cost: 15, redHerring: false, shortSummary: 'Broken cast aluminum link.',
        visualData: { imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop', description: 'Rough, grainy, crystalline fracture surface typical of a sudden overload in cast aluminum.', hasZoom: false, zoomDetails: '', annotations: [{x: 50, y: 50, label: 'Rough fracture surface'}] }
      }
    ]
  }
];

const realisticLocations = [
  'Offshore Oil Rig Delta-9',
  'Combined Cycle Power Plant Unit 3',
  'Deepwater Mining Facility Sector Alpha',
  'Automated Logistics Hub 12',
  'High-Speed Rail Maintenance Depot',
  'Naval Shipyard Drydock 4',
  'Aerospace Assembly Plant Building B',
  'Chemical Processing Plant Zone 7',
  'Semiconductor Fab Sub-Fab Level',
  'Heavy Manufacturing Facility Zone C'
];

export const generateCases = (): Case[] => {
  const generated: Case[] = [];

  BASE_CASES.forEach((base, index) => {
    for (let i = 0; i < 6; i++) {
      const location = realisticLocations[(index + i) % realisticLocations.length];
      const cloned = JSON.parse(JSON.stringify(base)) as Case;
      
      cloned.id = `${base.id}_variant_${i}`;
      cloned.title = `${base.title} (Unit ${i + 1})`;
      cloned.system = `${base.system} - ${location}`;
      cloned.taxonomyCauses = TAXONOMY_CAUSES;
      
      if (i % 3 === 0) cloned.difficulty = 'Beginner';
      else if (i % 3 === 1) cloned.difficulty = 'Intermediate';
      else cloned.difficulty = 'Advanced';

      generated.push(cloned);
    }
  });

  return generated;
};

export const INITIAL_CASES: Case[] = generateCases();
