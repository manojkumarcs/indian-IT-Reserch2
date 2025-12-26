
export interface FieldSource {
  field: string;
  url: string;
  sourceName: string;
  asOf: string;
}

export interface CompanyData {
  company: string;
  segment: string;
  ops: string;
  revenueUsdBn: string;
  revenueInrCr: string;
  employeesApprox: string;
  parentCompany: string;
  verificationStatus: 'verified' | 'estimated' | 'partial';
  // Metadata & Ratings
  glassdoorRating: string;
  naukriRating: string;
  linkedinRating: string;
  // Compensation Estimates (INR LPA)
  tester_0_2: string;
  tester_2_5: string;
  tester_5_10: string;
  cyber_0_2: string;
  cyber_2_5: string;
  cyber_5_10: string;
  devops_0_2: string;
  devops_2_5: string;
  devops_5_10: string;
  software_0_2: string;
  software_2_5: string;
  software_5_10: string;
  // Field-by-Field sources
  fieldSources: FieldSource[];
}

export interface VerificationLog {
  agent: string;
  check: string;
  status: 'passed' | 'warning';
  details: string;
}

export interface BenchmarkData {
  role: string;
  expBand: string;
  medianCtc: string;
  typicalRange: string;
  sources: string;
  sourceUrl?: string;
}

export interface ResearchResult {
  partA: CompanyData[];
  partB: BenchmarkData[];
  sources: {
    section: string;
    links: { label: string; url: string; asOf?: string }[];
  }[];
  groundingUrls: string[];
  verificationLog: VerificationLog[];
  overallConfidenceScore: number;
  dataCoverage: number; // Percentage of fields successfully filled
}
