export type TierKey = "free" | "job_hunting" | "beast";

export interface TierFeatures {
  resumeForge: boolean;
  basicTailoring: boolean;
  customTailoring: boolean;
  applicationTracking: boolean;
  resumeStorage: boolean;
  salaryResearch: boolean;
  advancedSalary: boolean;
  bulkCuration: boolean;
  coverLetter: boolean;
  pdfExport: boolean;
  detailedGapAnalysis: boolean;
  companyToneMatching: boolean;
  companyReviews: boolean;
}

const TIER_FEATURES: Record<TierKey, TierFeatures> = {
  free: {
    resumeForge: false,
    basicTailoring: true,
    customTailoring: false,
    applicationTracking: false,
    resumeStorage: false,
    salaryResearch: false,
    advancedSalary: false,
    bulkCuration: false,
    coverLetter: false,
    pdfExport: true,
    detailedGapAnalysis: false,
    companyToneMatching: false,
    companyReviews: false,
  },
  job_hunting: {
    resumeForge: true,
    basicTailoring: true,
    customTailoring: false,
    applicationTracking: true,
    resumeStorage: false,
    salaryResearch: true,
    advancedSalary: false,
    bulkCuration: false,
    coverLetter: false,
    pdfExport: true,
    detailedGapAnalysis: true,
    companyToneMatching: false,
    companyReviews: false,
  },
  beast: {
    resumeForge: true,
    basicTailoring: true,
    customTailoring: true,
    applicationTracking: true,
    resumeStorage: true,
    salaryResearch: true,
    advancedSalary: true,
    bulkCuration: true,
    coverLetter: true,
    pdfExport: true,
    detailedGapAnalysis: true,
    companyToneMatching: true,
    companyReviews: true,
  },
};

export function getTierFeatures(tier: string): TierFeatures {
  const key = tier as TierKey;
  return TIER_FEATURES[key] ?? TIER_FEATURES.free;
}

export function canAccess(tier: string, feature: keyof TierFeatures): boolean {
  return getTierFeatures(tier)[feature];
}
