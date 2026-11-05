import Dexie, { type Table } from 'dexie';
export interface Workspace { id: string; name: string; industry: string; brandVoice: string; products: string; businessTarget: string; createdAt: string }
export interface BudgetPlan { id: string; workspaceId: string; name: string; totalBudgetRp: number; periodStart: string; periodEnd: string; createdAt: string }
export interface Allocation { id: string; workspaceId: string; budgetPlanId: string; channel: string; type: 'Organik' | 'Berbayar'; percentage: number; estimatedResults: string; notes: string }
export interface ChatSession { id: string; workspaceId: string; title: string; updatedAt: string }
export interface ChatMessage { id: string; workspaceId: string; sessionId: string; role: 'user' | 'assistant'; text: string; createdAt: string; card?: { module: 'brief' | 'budget'; summary: string; payload: Record<string, any> } }
export interface Brief { id: string; workspaceId: string; goal: string; targetMarket: string; duration: string; totalBudgetRp: number; channels: string; competitors: string; notes: string; updatedAt: string }
export interface LocalSetting { id: 'local'; aiProvider: string; aiEndpoint: string; aiModel: string; aiApiKey: string; theme: 'light' | 'dark'; activeWorkspaceId: string }
class PlannerDB extends Dexie {
  workspaces!: Table<Workspace, string>; budgets!: Table<BudgetPlan, string>; allocations!: Table<Allocation, string>; sessions!: Table<ChatSession, string>; messages!: Table<ChatMessage, string>; briefs!: Table<Brief, string>; settings!: Table<LocalSetting, string>;
  constructor() { super('marketing-planner-ai'); this.version(1).stores({ workspaces: 'id,name', budgets: 'id,workspaceId,createdAt', allocations: 'id,workspaceId,budgetPlanId', sessions: 'id,workspaceId,updatedAt', messages: 'id,workspaceId,sessionId,createdAt', briefs: 'id,workspaceId,updatedAt', settings: 'id' }); }
}
export const db = new PlannerDB();
export const uid = () => crypto.randomUUID();
export const rupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);
