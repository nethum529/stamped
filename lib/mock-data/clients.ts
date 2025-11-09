import { Client } from '../types/client'

export const mockClients: Client[] = [
  {
    id: 'client-001',
    companyName: 'OpenAI, Inc.',
    industry: 'Technology',
    country: 'United States',
    city: 'San Francisco',
    address: '3180 18th Street, San Francisco, CA 94110',
    phone: '+1-415-568-7243',
    email: 'enterprise@openai.com',
    website: 'https://www.openai.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-001',
        stage: 'active',
        timestamp: new Date('2024-02-28T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Client approved and activated after successful KYC review. Enterprise banking relationship established for Series D funding round and ongoing operations. Relationship includes investment banking services, treasury management, and compliance advisory. Microsoft partnership with $13B investment commitment reviewed and approved.'
      },
      {
        id: 'hist-002',
        stage: 'compliance_review',
        timestamp: new Date('2024-02-10T14:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Enhanced due diligence completed for high-profile AI company. All documents submitted and verified. Microsoft partnership (announced January 2023 with $10B investment) and investment structure reviewed for compliance. Goldman Sachs advising on partnership renegotiations.'
      },
      {
        id: 'hist-003',
        stage: 'onboarding',
        timestamp: new Date('2024-01-15T09:00:00Z').toISOString(),
        changedBy: 'emp-001',
        changedByName: 'Emily Rodriguez',
        notes: 'Onboarding process initiated for OpenAI enterprise banking relationship. Initial engagement for Series D funding advisory services. Microsoft Azure cloud services partnership active since 2019.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 8,
      adverseMediaRisk: 15,
      financialRisk: 5,
      reputationalRisk: 18,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-12-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'investor_disclosures'],

    createdAt: new Date('2024-01-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-10T14:30:00Z').toISOString(),
    lastContactDate: new Date('2025-01-08T11:00:00Z').toISOString(),
    onboardingStartDate: new Date('2024-01-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2024-02-28T10:00:00Z').toISOString(),
    approvalDate: new Date('2024-02-28T10:00:00Z').toISOString(),

    annualRevenue: 2000000000, // $2B estimated revenue (2024)
    numberOfEmployees: 750, // OpenAI employee count
    primaryContact: {
      name: 'Sam Altman',
      email: 'sam.altman@openai.com',
      phone: '+1-415-568-7244',
      title: 'CEO'
    },
    notes: 'High-profile AI company and strategic client. Goldman Sachs served as financial advisor for OpenAI Foundation recapitalization (October 2025) and partnership renegotiations with Microsoft (October 2024). Microsoft is a major investor with $13B investment commitment announced in January 2023, increased to $135B stake (27% ownership) in October 2025. Enterprise banking relationship includes treasury services, cash management, and investment banking advisory. Microsoft Azure provides cloud infrastructure services. Ongoing relationship for future financing rounds and strategic transactions.'
  },
  {
    id: 'client-002',
    companyName: 'Stripe, Inc.',
    industry: 'Financial Services',
    country: 'United States',
    city: 'San Francisco',
    address: '510 Townsend Street, San Francisco, CA 94103',
    phone: '+1-415-888-0000',
    email: 'enterprise@stripe.com',
    website: 'https://stripe.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-004',
        stage: 'active',
        timestamp: new Date('2023-08-20T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Stripe approved as enterprise client. Banking relationship established for payment processing operations and treasury management.'
      },
      {
        id: 'hist-005',
        stage: 'compliance_review',
        timestamp: new Date('2023-07-15T14:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Compliance review completed. Fintech company with regulatory approvals verified (money transmitter licenses, PCI DSS compliance).'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 10,
      adverseMediaRisk: 12,
      financialRisk: 8,
      reputationalRisk: 15,
      geographicRisk: 8,
      lastAssessedAt: new Date('2024-11-15T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'regulatory_licenses'],

    createdAt: new Date('2023-06-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-12T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-05T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2023-06-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-08-20T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-08-20T10:00:00Z').toISOString(),

    annualRevenue: 14000000000, // $14B estimated revenue (2024)
    numberOfEmployees: 8000,
    primaryContact: {
      name: 'Patrick Collison',
      email: 'patrick@stripe.com',
      phone: '+1-415-888-0001',
      title: 'CEO'
    },
    notes: 'Leading fintech payment processing company. Enterprise banking relationship for payment operations, treasury management, and merchant services. High transaction volume requires enhanced monitoring. Regulatory compliance verified for money transmitter licenses across multiple jurisdictions.'
  },
  {
    id: 'client-003',
    companyName: 'Palantir Technologies Inc.',
    industry: 'Technology',
    country: 'United States',
    city: 'Denver',
    address: '1200 17th Street, Denver, CO 80202',
    phone: '+1-303-543-5000',
    email: 'enterprise@palantir.com',
    website: 'https://www.palantir.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-006',
        stage: 'active',
        timestamp: new Date('2022-11-10T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Palantir approved as enterprise client. Banking relationship established for government contracts and enterprise software operations.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'medium',
    riskAssessment: {
      overall: 'medium',
      sanctionsRisk: 25,
      adverseMediaRisk: 30,
      financialRisk: 15,
      reputationalRisk: 35,
      geographicRisk: 20,
      lastAssessedAt: new Date('2024-10-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'government_contract_disclosures'],

    createdAt: new Date('2022-09-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-10T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-08T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2022-09-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2022-11-10T10:00:00Z').toISOString(),
    approvalDate: new Date('2022-11-10T10:00:00Z').toISOString(),

    annualRevenue: 2200000000, // $2.2B revenue (2024)
    numberOfEmployees: 3800,
    primaryContact: {
      name: 'Alex Karp',
      email: 'alex.karp@palantir.com',
      phone: '+1-303-543-5001',
      title: 'CEO'
    },
    notes: 'Data analytics and software company with significant government contracts. Enhanced due diligence required due to government work and data privacy considerations. Banking relationship includes treasury management and investment banking services. Publicly traded company (NYSE: PLTR).'
  },
  {
    id: 'client-004',
    companyName: 'Coinbase Global, Inc.',
    industry: 'Financial Services',
    country: 'United States',
    city: 'San Francisco',
    address: '248 3rd Street #434, San Francisco, CA 94107',
    phone: '+1-888-908-7930',
    email: 'enterprise@coinbase.com',
    website: 'https://www.coinbase.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-008',
        stage: 'active',
        timestamp: new Date('2023-03-15T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Coinbase approved as enterprise client after enhanced due diligence for cryptocurrency exchange operations. Regulatory compliance verified with SEC and state regulators.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'medium',
    riskAssessment: {
      overall: 'medium',
      sanctionsRisk: 35,
      adverseMediaRisk: 40,
      financialRisk: 25,
      reputationalRisk: 38,
      geographicRisk: 30,
      lastAssessedAt: new Date('2024-11-20T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'regulatory_licenses', 'aml_compliance_documentation'],

    createdAt: new Date('2022-12-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-14T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-10T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2023-01-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-03-15T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-03-15T10:00:00Z').toISOString(),

    annualRevenue: 3100000000, // $3.1B revenue (2024)
    numberOfEmployees: 3700,
    primaryContact: {
      name: 'Brian Armstrong',
      email: 'brian.armstrong@coinbase.com',
      phone: '+1-888-908-7931',
      title: 'CEO'
    },
    notes: 'Major cryptocurrency exchange and digital asset platform. Enhanced due diligence and ongoing monitoring required due to crypto industry risks and regulatory scrutiny. Banking relationship includes treasury management, payment processing, and investment banking services. Publicly traded company (NASDAQ: COIN). Strong AML/KYC compliance program verified.'
  },
  {
    id: 'client-005',
    companyName: 'Anthropic PBC',
    industry: 'Technology',
    country: 'United States',
    city: 'San Francisco',
    address: '548 Market Street, PMB 90375, San Francisco, CA 94104',
    phone: '+1-415-967-0900',
    email: 'enterprise@anthropic.com',
    website: 'https://www.anthropic.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-009',
        stage: 'active',
        timestamp: new Date('2024-05-20T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Anthropic approved as enterprise client. Banking relationship established for Series C funding round and ongoing operations. Amazon is a major investor with $4 billion commitment.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 8,
      adverseMediaRisk: 12,
      financialRisk: 6,
      reputationalRisk: 15,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-12-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'investor_disclosures'],

    createdAt: new Date('2024-03-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-12T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-08T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2024-03-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2024-05-20T10:00:00Z').toISOString(),
    approvalDate: new Date('2024-05-20T10:00:00Z').toISOString(),

    annualRevenue: 850000000, // $850M estimated revenue (2024)
    numberOfEmployees: 400,
    primaryContact: {
      name: 'Dario Amodei',
      email: 'dario@anthropic.com',
      phone: '+1-415-967-0901',
      title: 'CEO'
    },
    notes: 'AI safety company and OpenAI competitor. Goldman Sachs served as co-lead investment bank for Series C funding round ($4B from Amazon). Enterprise banking relationship includes treasury services and investment banking advisory. Focus on AI safety and responsible AI development. Strong investor backing from Amazon, Google, and others.'
  },
  {
    id: 'client-006',
    companyName: 'Databricks Inc.',
    industry: 'Technology',
    country: 'United States',
    city: 'San Francisco',
    address: '160 Spear Street, 13th Floor, San Francisco, CA 94105',
    phone: '+1-415-817-5000',
    email: 'enterprise@databricks.com',
    website: 'https://www.databricks.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-010',
        stage: 'active',
        timestamp: new Date('2023-09-25T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Databricks approved as enterprise client. Banking relationship established for Series I funding round ($500M at $43B valuation) and ongoing operations.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 8,
      adverseMediaRisk: 10,
      financialRisk: 5,
      reputationalRisk: 12,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-11-15T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'investor_disclosures'],

    createdAt: new Date('2023-07-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-10T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-05T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2023-07-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-09-25T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-09-25T10:00:00Z').toISOString(),

    annualRevenue: 1600000000, // $1.6B revenue (2024)
    numberOfEmployees: 5500,
    primaryContact: {
      name: 'Ali Ghodsi',
      email: 'ali@databricks.com',
      phone: '+1-415-817-5001',
      title: 'CEO'
    },
    notes: 'Unified analytics platform and data lakehouse company. Goldman Sachs served as co-lead investment bank for Series I funding round. Valued at $43 billion. Enterprise banking relationship includes treasury services and investment banking advisory. Strong growth trajectory in enterprise data analytics market.'
  },
  {
    id: 'client-007',
    companyName: 'Rivian Automotive, LLC',
    industry: 'Manufacturing',
    country: 'United States',
    city: 'Irvine',
    address: '14600 Myford Road, Irvine, CA 92606',
    phone: '+1-949-398-0500',
    email: 'enterprise@rivian.com',
    website: 'https://www.rivian.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-011',
        stage: 'active',
        timestamp: new Date('2021-11-10T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Rivian approved as enterprise client. Goldman Sachs served as lead investment bank for IPO (NASDAQ: RIVN) in November 2021, raising $11.9 billion.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 18,
      financialRisk: 20,
      reputationalRisk: 15,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-12-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'sec_filings'],

    createdAt: new Date('2021-08-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-15T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-12T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2021-08-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2021-11-10T10:00:00Z').toISOString(),
    approvalDate: new Date('2021-11-10T10:00:00Z').toISOString(),

    annualRevenue: 4400000000, // $4.4B revenue (2024)
    numberOfEmployees: 14000,
    primaryContact: {
      name: 'RJ Scaringe',
      email: 'rj.scaringe@rivian.com',
      phone: '+1-949-398-0501',
      title: 'CEO'
    },
    notes: 'Electric vehicle manufacturer. Goldman Sachs served as lead left bookrunner for IPO in November 2021, the largest US IPO since 2014. Raised $11.9 billion at $77 billion valuation. Ongoing banking relationship for treasury management, working capital financing, and investment banking services. Publicly traded company (NASDAQ: RIVN). Major investors include Amazon and Ford.'
  },
  {
    id: 'client-008',
    companyName: 'Snowflake Inc.',
    industry: 'Technology',
    country: 'United States',
    city: 'Bozeman',
    address: '106 East Babcock Street, Suite 3A, Bozeman, MT 59715',
    phone: '+1-406-219-5500',
    email: 'enterprise@snowflake.com',
    website: 'https://www.snowflake.com',

    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-012',
        stage: 'active',
        timestamp: new Date('2020-09-16T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Snowflake approved as enterprise client. Goldman Sachs served as lead left bookrunner for IPO (NYSE: SNOW) in September 2020, the largest software IPO in history at that time. Raised $3.4 billion.'
      }
    ],

    assignedRM: 'emp-001',
    assignedRMName: 'Emily Rodriguez',
    assignedOfficer: 'emp-003',
    assignedOfficerName: 'Sarah Johnson',

    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 8,
      financialRisk: 4,
      reputationalRisk: 10,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-11-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },

    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'beneficial_ownership', 'financial_statements', 'sec_filings'],

    createdAt: new Date('2020-06-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-12T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-10T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2020-07-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2020-09-16T10:00:00Z').toISOString(),
    approvalDate: new Date('2020-09-16T10:00:00Z').toISOString(),

    annualRevenue: 2800000000, // $2.8B revenue (2024)
    numberOfEmployees: 7000,
    primaryContact: {
      name: 'Frank Slootman',
      email: 'frank.slootman@snowflake.com',
      phone: '+1-406-219-5501',
      title: 'CEO'
    },
    notes: 'Cloud data platform company. Goldman Sachs served as lead left bookrunner for historic IPO in September 2020, raising $3.4 billion at $33 billion valuation - the largest software IPO in history at that time. Ongoing banking relationship for treasury management and investment banking services. Publicly traded company (NYSE: SNOW). Strong growth in enterprise data warehousing and analytics market.'
  },
]
