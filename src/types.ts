export type UserRole = "employee" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  pharmacyName: string;
  city: string;
  complianceScore: number; // Taux de conformité clinique moyen (ex: 94%)
  trainingSessionsCount: number; // Nombre de sessions validées
  lastActiveDate: string; // ex: "Aujourd'hui, 11h30"
  completedScenarios: string[];
  archivedScenarios: string[]; // Cas validés et archivés pour ne plus retomber dessus
  favoriteMeds: string[];
}

export interface PharmacyCampaign {
  title: string;
  categoryTarget: "antibiotique" | "ains_douleur" | "substitution_generique" | "pediatrie" | "dermocosmetique" | "all";
  directive: string;
  targetConversionRate: number;
  authorName: string;
  activeUntil: string;
}

export interface Medication {
  id: string;
  dci: string; // Dénomination Commune Internationale (ex: Amoxicilline)
  brandNames: string[]; // Princeps & Génériques (ex: Clamoxyl, Augmentin, Amoksiklav)
  category: string; // ex: Antibiotique, AINS, Cardiologie, Gastro-entérologie, OTC
  form: string; // Comprimé, Gélule, Sirop
  commonDosage: string;
  indication: string;
  keySideEffects: string[];
  contraindications: string[];
  // Le volet commercial & conseil éthique
  companionProduct: {
    name: string;
    category: string;
    priceDh: number; // Prix public réglementé en DH
    marginBoostPct: number; // ex: +38% marge brute officine
    clinicalJustification: string;
    patientBenefit: string;
    counterPitch: string;
  };
  substitutionNote?: {
    originalDoctorPrescription: string;
    recommendedAlternative: string;
    patientSavingsDh: number; // Économie patient en DH
    whyBetterForPatient: string;
    whyBetterForPharmacy: string;
    dialogueScript: string;
  };
}

export type ScenarioCategory = 
  | "antibiotique" 
  | "ains_douleur" 
  | "substitution_generique" 
  | "pediatrie" 
  | "dermocosmetique" 
  | "cardiologie" 
  | "grossesse_femme" 
  | "gastro_enterologie"
  | "all";

export type CustomerEmotion = 
  | "inquiet" 
  | "pressé" 
  | "sceptique" 
  | "ouvert" 
  | "douloureux" 
  | "hésitant";

export interface SimulationChoice {
  id: string;
  text: string;
  isOptimal: boolean;
  clinicalScore: number;
  businessScore: number;
  empathyScore: number;
  feedback: string;
  psychologyMechanism: string;
}

export interface SimulationStep {
  customerSay: string;
  customerEmotion: CustomerEmotion;
  choices: SimulationChoice[];
}

export interface PrescriptionItem {
  name: string;
  dosage: string;
  posology: string;
  duration: string;
  priceDh: number;
  isPrinceps?: boolean;
}

export interface PrescriptionDetails {
  doctorName: string;
  doctorSpecialty: string;
  clinicAddress: string;
  date: string;
  items: PrescriptionItem[];
  clinicalNotes?: string;
}

export interface CounterScenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: "Débutant" | "Intermédiaire" | "Expert";
  estimatedMinutes: number;
  customer: {
    name: string;
    initials: string;
    age: number;
    situation: string;
    spokenLanguages: string;
  };
  goal: string;
  prescriptionContext?: string;
  prescriptionDetails?: PrescriptionDetails;
  prescriptionBasePriceDh: number; // Prix Public Maroc (PPM) initial
  targetAddon: string;
  addonPriceDh: number; // Prix du produit conseil associé en DH
  addonMarginPct: number; // Marge officine sur le produit associé
  netMarginGainDh: number; // Gain net de marge brute officine en DH
  economicImpactSummary: string; // Synthèse chiffrée transparente
  clinicalOutcome: string; // Résultat clinique & observance
  takeaways?: string[]; // 3 règles d'or à retenir au comptoir
  steps: SimulationStep[];
}

export interface AuditItem {
  area: string;
  before: string;
  after: string;
  impact: string;
}
