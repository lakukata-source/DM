import { db, type LocalSetting } from './db';
const DEFAULTS: LocalSetting = { id: 'local', aiProvider: 'OpenAI-compatible', aiEndpoint: 'https://api.openai.com/v1/chat/completions', aiModel: 'gpt-4o-mini', aiApiKey: '', theme: 'light', activeWorkspaceId: '' };
export async function getSettings() { return (await db.settings.get('local')) ?? DEFAULTS; }
export async function saveSettings(value: LocalSetting) { await db.settings.put(value); }
export async function exportBackup() {
  const [workspaces, budgets, allocations, sessions, messages, briefs, settings] = await Promise.all([db.workspaces.toArray(), db.budgets.toArray(), db.allocations.toArray(), db.sessions.toArray(), db.messages.toArray(), db.briefs.toArray(), getSettings()]);
  const safeSettings = { ...settings, aiApiKey: '' };
  const blob = new Blob([JSON.stringify({ format: 'marketing-planner-backup', version: 1, exportedAt: new Date().toISOString(), workspaces, budgets, allocations, sessions, messages, briefs, settings: safeSettings }, null, 2)], { type: 'application/json' });
  download(blob, `marketing-planner-backup-${new Date().toISOString().slice(0, 10)}.json`);
}
export async function importBackup(file: File) {
  const data = JSON.parse(await file.text());
  if (data.format !== 'marketing-planner-backup' || data.version !== 1) throw new Error('Format cadangan tidak dikenali.');
  await db.transaction('rw', db.workspaces, db.budgets, db.allocations, db.sessions, db.messages, db.briefs, async () => {
    await Promise.all([db.workspaces.bulkPut(data.workspaces ?? []), db.budgets.bulkPut(data.budgets ?? []), db.allocations.bulkPut(data.allocations ?? []), db.sessions.bulkPut(data.sessions ?? []), db.messages.bulkPut(data.messages ?? []), db.briefs.bulkPut(data.briefs ?? [])]);
  });
}
export function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }
