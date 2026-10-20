import type { Domain, Topic } from '../types';

export const DOMAINS: Domain[] = [
  {
    id: 'cloud-concepts',
    name: 'Cloud Concepts',
    shortName: 'Cloud Concepts',
    weightRange: '25–30%',
    description: 'What cloud computing is, the shared responsibility model, cloud models, consumption pricing, and the benefits of cloud like availability, scalability, and reliability.',
  },
  {
    id: 'azure-architecture',
    name: 'Azure Architecture and Services',
    shortName: 'Architecture & Services',
    weightRange: '35–40%',
    description: 'Azure regions and availability zones, compute, networking, storage, and identity services including Microsoft Entra ID and security concepts.',
  },
  {
    id: 'azure-management',
    name: 'Azure Management and Governance',
    shortName: 'Management & Governance',
    weightRange: '30–35%',
    description: 'Cost management, governance tools like Azure Policy and resource locks, management tools including the CLI and portal, monitoring, and infrastructure as code.',
  },
];

export const TOPICS: Topic[] = [
  // Cloud Concepts
  { id: 'cc-define', domainId: 'cloud-concepts', name: 'What is cloud computing' },
  { id: 'cc-shared', domainId: 'cloud-concepts', name: 'Shared responsibility model' },
  { id: 'cc-models', domainId: 'cloud-concepts', name: 'Public, private & hybrid cloud' },
  { id: 'cc-consumption', domainId: 'cloud-concepts', name: 'Consumption-based pricing' },
  { id: 'cc-economies', domainId: 'cloud-concepts', name: 'Economies of scale' },
  { id: 'cc-benefits', domainId: 'cloud-concepts', name: 'Cloud benefits (availability, scalability, elasticity)' },
  { id: 'cc-reliability', domainId: 'cloud-concepts', name: 'Reliability, predictability & security' },
  { id: 'cc-governance', domainId: 'cloud-concepts', name: 'Governance & manageability' },

  // Azure Architecture and Services
  { id: 'ar-regions', domainId: 'azure-architecture', name: 'Regions & availability zones' },
  { id: 'ar-resources', domainId: 'azure-architecture', name: 'Resources, groups & subscriptions' },
  { id: 'ar-compute', domainId: 'azure-architecture', name: 'Compute options (VMs, containers, functions)' },
  { id: 'ar-vmoptions', domainId: 'azure-architecture', name: 'VM scale sets, availability sets & AVD' },
  { id: 'ar-networking', domainId: 'azure-architecture', name: 'Virtual networks & subnets' },
  { id: 'ar-netpeer', domainId: 'azure-architecture', name: 'Peering, DNS, VPN & ExpressRoute' },
  { id: 'ar-endpoints', domainId: 'azure-architecture', name: 'Public & private endpoints' },
  { id: 'ar-storage', domainId: 'azure-architecture', name: 'Storage services, tiers & redundancy' },
  { id: 'ar-storagetools', domainId: 'azure-architecture', name: 'AzCopy, Storage Explorer & File Sync' },
  { id: 'ar-migrate', domainId: 'azure-architecture', name: 'Azure Migrate & Data Box' },
  { id: 'ar-entra', domainId: 'azure-architecture', name: 'Microsoft Entra ID & authentication' },
  { id: 'ar-identity', domainId: 'azure-architecture', name: 'SSO, MFA, passwordless & external identities' },
  { id: 'ar-security', domainId: 'azure-architecture', name: 'RBAC, Zero Trust & Defender for Cloud' },

  // Azure Management and Governance
  { id: 'mg-cost', domainId: 'azure-management', name: 'Cost factors & Pricing Calculator' },
  { id: 'mg-costmgmt', domainId: 'azure-management', name: 'Cost management & resource tags' },
  { id: 'mg-purview', domainId: 'azure-management', name: 'Microsoft Purview' },
  { id: 'mg-policy', domainId: 'azure-management', name: 'Azure Policy & resource locks' },
  { id: 'mg-portal', domainId: 'azure-management', name: 'Portal, Cloud Shell, CLI & PowerShell' },
  { id: 'mg-arc', domainId: 'azure-management', name: 'Azure Arc' },
  { id: 'mg-iac', domainId: 'azure-management', name: 'Infrastructure as code & ARM templates' },
  { id: 'mg-advisor', domainId: 'azure-management', name: 'Azure Advisor & Service Health' },
  { id: 'mg-monitor', domainId: 'azure-management', name: 'Azure Monitor, Log Analytics & alerts' },
  { id: 'mg-appinsights', domainId: 'azure-management', name: 'Application Insights' },
];

export function getDomain(id: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === id);
}

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function topicsForDomain(domainId: string): Topic[] {
  return TOPICS.filter((t) => t.domainId === domainId);
}
