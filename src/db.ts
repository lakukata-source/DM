import Dexie, { type Table } from 'dexie';

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  brandVoice: string;
  products: string;
  businessTarget: string;
  createdAt: string;
}

export interface StrategyPlan {
  id: string;
  workspaceId: string;
  brief: string;
  targetBusiness: string;
  kpis: string;
  funnel: string;
  timeline: string;
  updatedAt: string;
}

export interface ResearchInsight {
  id: string;
  workspaceId: string;
  persona: string;
  competitorMatrix: string;
  swot: string;
  notes: string;
  updatedAt: string;
}

export interface CampaignPlan {
  id: string;
  workspaceId: string;
  campaignName: string;
  objective: string;
  channels: string;
  headline: string;
  copy: string;
  checklist: string;
  updatedAt: string;
}

export interface AbTest {
  id: string;
  workspaceId: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  trafficShare: number;
  conversionA: number;
  conversionB: number;
  confidence: number;
  updatedAt: string;
}

export interface BudgetPlan {
  id: string;
  workspaceId: string;
  name: string;
  totalBudgetRp: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface Allocation {
  id: string;
  workspaceId: string;
  budgetPlanId: string;
  channel: string;
  type: 'Organik' | 'Berbayar';
  percentage: number;
  estimatedResults: string;
  notes: string;
}

export interface ChatSession {
  id: string;
  workspaceId: string;
  title: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  workspaceId: string;
  sessionId: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  card?: {
    module: 'brief' | 'budget' | 'strategy';
    summary: string;
    payload: Record<string, any>;
  };
}

export interface Brief {
  id: string;
  workspaceId: string;
  goal: string;
  targetMarket: string;
  duration: string;
  totalBudgetRp: number;
  channels: string;
  competitors: string;
  notes: string;
  updatedAt: string;
}

export interface ReportRecord {
  id: string;
  workspaceId: string;
  date: string;
  channel: string;
  spendRp: number;
  revenueRp: number;
  clicks: number;
  impressions: number;
  conversions: number;
  engagements: number;
  reach: number;
  createdAt: string;
}

export interface LocalSetting {
  id: 'local';
  aiProvider: string;
  aiEndpoint: string;
  aiModel: string;
  aiApiKey: string;
  theme: 'light' | 'dark';
  activeWorkspaceId: string;
}

class PlannerDB extends Dexie {
  workspaces!: Table<Workspace, string>;
  strategies!: Table<StrategyPlan, string>;
  research!: Table<ResearchInsight, string>;
  campaigns!: Table<CampaignPlan, string>;
  abtests!: Table<AbTest, string>;
  budgets!: Table<BudgetPlan, string>;
  allocations!: Table<Allocation, string>;
  sessions!: Table<ChatSession, string>;
  messages!: Table<ChatMessage, string>;
  briefs!: Table<Brief, string>;
  reports!: Table<ReportRecord, string>;
  settings!: Table<LocalSetting, string>;

  constructor() {
    super('marketing-planner-ai');
    this.version(2).stores({
      workspaces: 'id,name',
      strategies: 'id,workspaceId,updatedAt',
      research: 'id,workspaceId,updatedAt',
      campaigns: 'id,workspaceId,updatedAt',
      abtests: 'id,workspaceId,updatedAt',
      budgets: 'id,workspaceId,createdAt',
      allocations: 'id,workspaceId,budgetPlanId',
      sessions: 'id,workspaceId,updatedAt',
      messages: 'id,workspaceId,sessionId,createdAt',
      briefs: 'id,workspaceId,updatedAt',
      reports: 'id,workspaceId,date',
      settings: 'id'
    });
  }
}

export const db = new PlannerDB();
export const uid = () => crypto.randomUUID();
export const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number.isFinite(n) ? n : 0);
