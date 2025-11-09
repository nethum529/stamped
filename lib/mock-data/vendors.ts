import { Vendor } from '../types/vendor'

export const mockVendors: Vendor[] = [
  {
    id: 'vendor-001',
    companyName: 'Microsoft Corporation',
    category: 'IT Services',
    industry: 'Technology',
    country: 'United States',
    city: 'Redmond',
    address: 'One Microsoft Way, Redmond, WA 98052',
    phone: '+1-425-882-8080',
    email: 'vendor-relations@microsoft.com',
    website: 'https://www.microsoft.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-001-1',
        stage: 'active',
        timestamp: new Date('2023-07-01T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Vendor approved and activated. Multi-year enterprise agreement signed for Azure cloud services, Office 365, and enterprise software licenses. Primary cloud infrastructure provider for client data hosting, including OpenAI partnership services.'
      },
      {
        id: 'hist-vendor-001-2',
        stage: 'compliance_review',
        timestamp: new Date('2023-06-15T14:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Compliance review completed. All certifications verified (SOC 2 Type II, ISO 27001, GDPR compliant). Microsoft Azure infrastructure approved for hosting client data, including OpenAI services. Microsoft-OpenAI partnership reviewed for compliance.'
      },
      {
        id: 'hist-vendor-001-3',
        stage: 'onboarding',
        timestamp: new Date('2023-06-01T09:00:00Z').toISOString(),
        changedBy: 'emp-002',
        changedByName: 'David Kim',
        notes: 'Vendor onboarding initiated for enterprise cloud and software services. Microsoft Azure selected as primary cloud provider following OpenAI partnership announcement (January 2023, $10B investment).'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 8,
      financialRisk: 3,
      reputationalRisk: 10,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-12-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements', 'compliance_certifications'],
    
    createdAt: new Date('2023-05-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-08T14:30:00Z').toISOString(),
    lastContactDate: new Date('2025-01-05T11:00:00Z').toISOString(),
    onboardingStartDate: new Date('2023-06-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-07-01T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-07-01T10:00:00Z').toISOString(),
    contractStartDate: new Date('2023-07-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2026-06-30T23:59:59Z').toISOString(),
    
    annualSpend: 45000000, // $45M annual spend on Azure, Office 365, and enterprise licenses
    numberOfEmployees: 221000, // Microsoft's actual employee count
    primaryContact: {
      name: 'Jennifer Martinez',
      title: 'Enterprise Account Manager',
      email: 'jennifer.martinez@microsoft.com',
      phone: '+1-425-882-8123'
    },
    services: [
      'Azure Cloud Services',
      'Office 365 Enterprise',
      'Microsoft 365',
      'Enterprise Software Licenses',
      'Azure AI Services',
      'Security and Compliance Tools'
    ],
    notes: 'Primary cloud infrastructure and productivity software vendor. Multi-year enterprise agreement signed July 2023. Provides critical Azure cloud services for client data hosting, including OpenAI partnership infrastructure (Microsoft invested $10B in January 2023, increased to $135B stake in October 2025). Office 365 for employee productivity. Microsoft serves as cloud infrastructure provider for OpenAI client services. Contract includes dedicated support and SLA guarantees. Key vendor relationship supporting Goldman Sachs client portfolio including OpenAI, Anthropic, and other AI clients.'
  },
  {
    id: 'vendor-002',
    companyName: 'Amazon Web Services (AWS)',
    category: 'IT Services',
    industry: 'Technology',
    country: 'United States',
    city: 'Seattle',
    address: '410 Terry Avenue North, Seattle, WA 98109',
    phone: '+1-206-266-1000',
    email: 'enterprise-support@amazon.com',
    website: 'https://aws.amazon.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-002-1',
        stage: 'active',
        timestamp: new Date('2022-11-10T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'AWS enterprise agreement activated. Multi-cloud strategy implementation.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 10,
      financialRisk: 2,
      reputationalRisk: 12,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-11-15T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements', 'compliance_certifications'],
    
    createdAt: new Date('2022-09-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-11-20T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-05T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2022-09-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2022-11-10T10:00:00Z').toISOString(),
    approvalDate: new Date('2022-11-10T10:00:00Z').toISOString(),
    contractStartDate: new Date('2022-12-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2025-11-30T23:59:59Z').toISOString(),
    
    annualSpend: 32000000, // $32M annual spend
    numberOfEmployees: 1540000, // Amazon's total employees (AWS is a division)
    primaryContact: {
      name: 'Robert Chen',
      title: 'Senior Enterprise Account Executive',
      email: 'robert.chen@amazon.com',
      phone: '+1-206-266-1234'
    },
    services: [
      'AWS Cloud Infrastructure',
      'EC2 Compute Services',
      'S3 Storage',
      'Lambda Serverless',
      'AWS Security Services',
      'Data Analytics Services'
    ],
    notes: 'Secondary cloud provider for multi-cloud redundancy strategy. Enterprise agreement includes reserved instances and committed use discounts. Critical for disaster recovery and backup infrastructure.'
  },
  {
    id: 'vendor-003',
    companyName: 'Salesforce.com, Inc.',
    category: 'IT Services',
    industry: 'Technology',
    country: 'United States',
    city: 'San Francisco',
    address: '415 Mission Street, 3rd Floor, San Francisco, CA 94105',
    phone: '+1-415-901-7000',
    email: 'enterprise@salesforce.com',
    website: 'https://www.salesforce.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-003-1',
        stage: 'active',
        timestamp: new Date('2023-03-20T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Salesforce enterprise license activated for CRM and client relationship management.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 8,
      financialRisk: 5,
      reputationalRisk: 10,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-10-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements', 'compliance_certifications'],
    
    createdAt: new Date('2023-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-01T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-11-28T11:00:00Z').toISOString(),
    onboardingStartDate: new Date('2023-02-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-03-20T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-03-20T10:00:00Z').toISOString(),
    contractStartDate: new Date('2023-04-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2026-03-31T23:59:59Z').toISOString(),
    
    annualSpend: 8500000, // $8.5M annual spend
    numberOfEmployees: 73000,
    primaryContact: {
      name: 'Michael Thompson',
      title: 'Enterprise Account Director',
      email: 'michael.thompson@salesforce.com',
      phone: '+1-415-901-7123'
    },
    services: [
      'Sales Cloud Enterprise',
      'Service Cloud',
      'Marketing Cloud',
      'Salesforce Platform',
      'Tableau Analytics',
      'MuleSoft Integration'
    ],
    notes: 'Primary CRM platform for client relationship management and sales pipeline tracking. Enterprise edition with custom integrations. Includes Tableau for business analytics and MuleSoft for API integrations.'
  },
  {
    id: 'vendor-004',
    companyName: 'Oracle Corporation',
    category: 'IT Services',
    industry: 'Technology',
    country: 'United States',
    city: 'Austin',
    address: '2300 Oracle Way, Austin, TX 78741',
    phone: '+1-512-506-7000',
    email: 'oracle-enterprise@oracle.com',
    website: 'https://www.oracle.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-004-1',
        stage: 'active',
        timestamp: new Date('2022-08-15T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Oracle database and enterprise software licenses approved.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 8,
      financialRisk: 4,
      reputationalRisk: 10,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-09-15T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements', 'compliance_certifications'],
    
    createdAt: new Date('2022-06-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-10T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-08T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2022-07-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2022-08-15T10:00:00Z').toISOString(),
    approvalDate: new Date('2022-08-15T10:00:00Z').toISOString(),
    contractStartDate: new Date('2022-09-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2025-08-31T23:59:59Z').toISOString(),
    
    annualSpend: 12500000, // $12.5M annual spend
    numberOfEmployees: 164000,
    primaryContact: {
      name: 'Patricia Williams',
      title: 'Enterprise License Manager',
      email: 'patricia.williams@oracle.com',
      phone: '+1-512-506-7123'
    },
    services: [
      'Oracle Database Enterprise Edition',
      'Oracle Cloud Infrastructure',
      'Oracle E-Business Suite',
      'Oracle Financial Services',
      'Oracle Security and Compliance Tools'
    ],
    notes: 'Critical database infrastructure vendor. Oracle databases host core financial transaction systems. Enterprise license agreement includes 24/7 support and dedicated DBA resources.'
  },
  {
    id: 'vendor-005',
    companyName: 'ServiceNow, Inc.',
    category: 'IT Services',
    industry: 'Technology',
    country: 'United States',
    city: 'Santa Clara',
    address: '2225 Lawson Lane, Santa Clara, CA 95054',
    phone: '+1-408-501-8550',
    email: 'enterprise@servicenow.com',
    website: 'https://www.servicenow.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-005-1',
        stage: 'active',
        timestamp: new Date('2023-09-10T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'ServiceNow platform activated for IT service management and workflow automation.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 7,
      financialRisk: 5,
      reputationalRisk: 8,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-11-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements', 'compliance_certifications'],
    
    createdAt: new Date('2023-07-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-05T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-11-25T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2023-08-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-09-10T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-09-10T10:00:00Z').toISOString(),
    contractStartDate: new Date('2023-10-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2026-09-30T23:59:59Z').toISOString(),
    
    annualSpend: 4200000, // $4.2M annual spend
    numberOfEmployees: 22000,
    primaryContact: {
      name: 'Christopher Lee',
      title: 'Enterprise Account Executive',
      email: 'christopher.lee@servicenow.com',
      phone: '+1-408-501-8650'
    },
    services: [
      'IT Service Management',
      'IT Operations Management',
      'Security Operations',
      'Governance, Risk & Compliance',
      'HR Service Delivery',
      'Customer Service Management'
    ],
    notes: 'Enterprise workflow automation and IT service management platform. Used for internal IT operations, security incident management, and compliance tracking. Includes custom workflows for client onboarding and document management.'
  },
  {
    id: 'vendor-006',
    companyName: 'Deloitte Touche Solutions',
    category: 'Consulting',
    industry: 'Professional Services',
    country: 'United States',
    city: 'New York',
    address: '30 Rockefeller Plaza, New York, NY 10112',
    phone: '+1-212-492-4000',
    email: 'gs-engagement@deloitte.com',
    website: 'https://www2.deloitte.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-006-1',
        stage: 'active',
        timestamp: new Date('2023-01-20T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Deloitte approved for consulting services including risk advisory, regulatory compliance, and technology implementation.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 10,
      financialRisk: 3,
      reputationalRisk: 12,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-10-15T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'professional_licenses', 'insurance_certificates'],
    
    createdAt: new Date('2022-12-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-12T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-05T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2022-12-15T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2023-01-20T10:00:00Z').toISOString(),
    approvalDate: new Date('2023-01-20T10:00:00Z').toISOString(),
    contractStartDate: new Date('2023-02-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2026-01-31T23:59:59Z').toISOString(),
    
    annualSpend: 18000000, // $18M annual spend on consulting services
    numberOfEmployees: 457000, // Deloitte global employees
    primaryContact: {
      name: 'Amanda Rodriguez',
      title: 'Partner, Financial Services',
      email: 'amanda.rodriguez@deloitte.com',
      phone: '+1-212-492-4123'
    },
    services: [
      'Risk Advisory Services',
      'Regulatory Compliance Consulting',
      'Technology Implementation',
      'Financial Advisory',
      'Cyber Security Consulting',
      'Internal Audit Services'
    ],
    notes: 'Strategic consulting partner for risk management, regulatory compliance, and technology implementations. Engaged for major compliance framework implementations and regulatory change management projects. Master services agreement with multiple project-based engagements.'
  },
  {
    id: 'vendor-007',
    companyName: 'Bloomberg L.P.',
    category: 'Professional Services',
    industry: 'Financial Services',
    country: 'United States',
    city: 'New York',
    address: '731 Lexington Avenue, New York, NY 10022',
    phone: '+1-212-318-2000',
    email: 'enterprise@bloomberg.com',
    website: 'https://www.bloomberg.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-007-1',
        stage: 'active',
        timestamp: new Date('2021-03-15T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Bloomberg Terminal and data services agreement activated. Critical for market data and trading operations.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 8,
      financialRisk: 2,
      reputationalRisk: 10,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-12-01T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements'],
    
    createdAt: new Date('2021-01-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-15T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-12T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2021-02-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2021-03-15T10:00:00Z').toISOString(),
    approvalDate: new Date('2021-03-15T10:00:00Z').toISOString(),
    contractStartDate: new Date('2021-04-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2025-03-31T23:59:59Z').toISOString(),
    
    annualSpend: 25000000, // $25M annual spend on Bloomberg Terminals and data
    numberOfEmployees: 21000,
    primaryContact: {
      name: 'Jonathan Stern',
      title: 'Enterprise Account Manager',
      email: 'jonathan.stern@bloomberg.com',
      phone: '+1-212-318-2123'
    },
    services: [
      'Bloomberg Terminal Licenses',
      'Market Data Feeds',
      'Trading Platform Access',
      'News and Research Services',
      'Analytics and Risk Tools',
      'Compliance Data Services'
    ],
    notes: 'Critical vendor for financial market data and trading operations. Bloomberg Terminal is essential for trading desks, research, and risk management. Multi-year enterprise license covering 500+ terminal seats. Includes real-time market data, news, analytics, and compliance monitoring tools.'
  },
  {
    id: 'vendor-008',
    companyName: 'Refinitiv (formerly Thomson Reuters)',
    category: 'Professional Services',
    industry: 'Financial Services',
    country: 'United States',
    city: 'New York',
    address: '3 Times Square, New York, NY 10036',
    phone: '+1-646-223-4000',
    email: 'enterprise@refinitiv.com',
    website: 'https://www.refinitiv.com',
    
    lifecycleStage: 'active',
    status: 'approved',
    lifecycleHistory: [
      {
        id: 'hist-vendor-008-1',
        stage: 'active',
        timestamp: new Date('2022-05-10T10:00:00Z').toISOString(),
        changedBy: 'emp-003',
        changedByName: 'Sarah Johnson',
        notes: 'Refinitiv Eikon and data services approved. Secondary market data provider for redundancy.'
      }
    ],
    
    assignedProcurementOfficer: 'emp-002',
    assignedProcurementOfficerName: 'David Kim',
    assignedComplianceOfficer: 'emp-003',
    assignedComplianceOfficerName: 'Sarah Johnson',
    
    riskLevel: 'low',
    riskAssessment: {
      overall: 'low',
      sanctionsRisk: 5,
      adverseMediaRisk: 8,
      financialRisk: 4,
      reputationalRisk: 10,
      geographicRisk: 5,
      lastAssessedAt: new Date('2024-11-15T10:00:00Z').toISOString(),
      lastAssessedBy: 'Sarah Johnson'
    },
    
    documents: [],
    requiredDocuments: ['certificate_of_incorporation', 'proof_of_address', 'business_license', 'financial_statements'],
    
    createdAt: new Date('2022-03-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-10T14:00:00Z').toISOString(),
    lastContactDate: new Date('2024-12-03T10:00:00Z').toISOString(),
    onboardingStartDate: new Date('2022-04-01T09:00:00Z').toISOString(),
    onboardingCompletedDate: new Date('2022-05-10T10:00:00Z').toISOString(),
    approvalDate: new Date('2022-05-10T10:00:00Z').toISOString(),
    contractStartDate: new Date('2022-06-01T00:00:00Z').toISOString(),
    contractEndDate: new Date('2025-05-31T23:59:59Z').toISOString(),
    
    annualSpend: 12000000, // $12M annual spend
    numberOfEmployees: 18000,
    primaryContact: {
      name: 'Elizabeth Brown',
      title: 'Senior Enterprise Sales Director',
      email: 'elizabeth.brown@refinitiv.com',
      phone: '+1-646-223-4123'
    },
    services: [
      'Refinitiv Eikon Platform',
      'Market Data Feeds',
      'Risk Management Solutions',
      'Compliance Data',
      'KYC and Due Diligence Data',
      'Sanctions Screening Data'
    ],
    notes: 'Secondary market data provider and critical source for KYC, due diligence, and sanctions screening data. Refinitiv World-Check and other compliance databases are essential for client onboarding and ongoing monitoring. Used alongside Bloomberg for data redundancy and verification.'
  },
]

