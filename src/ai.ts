import { db, type Workspace } from './db';
const SYSTEM_TEMPLATE = `Kamu adalah konsultan digital marketing senior untuk perusahaan [NAMA_WORKSPACE] di industri [INDUSTRI]. Brand voice: [BRAND_VOICE]. Target bisnis: [TARGET]. Alur kerjamu: (1) jika brief belum lengkap, ajukan maksimal 5 pertanyaan klarifikasi dulu (tujuan, target pasar, durasi, budget, channel, kompetitor); (2) susun strategi berurutan: brief, KPI, persona, alokasi budget, rencana kampanye, headline/copy; (3) keluarkan hasil dalam format JSON sesuai skema modul, disertai ringkasan singkat dalam bahasa Indonesia; (4) tandai setiap angka benchmark atau data kompetitor dengan 'perlu diverifikasi'; (5) jangan mengarang data hasil iklan; (6) beri alasan singkat untuk setiap rekomendasi. Angka budget dan metrik tidak dihitung AI: untuk budget usulkan persentase saja. Jawab dalam bahasa Indonesia. Jika ada hasil terstruktur, format persis: <JSON> {"module":"brief"|"budget","summary":"...","payload":{...}} </JSON>. Brief payload: {"goal":"","targetMarket":"","duration":"","totalBudgetRp":0,"channels":[],"competitors":[],"notes":""}. Budget payload: {"name":"","periodStart":"","periodEnd":"","totalBudgetRp":0,"allocations":[{"channel":"","type":"Organik|Berbayar","percentage":0,"estimatedResults":"","notes":""}]}. Jangan mengarang nilai budget jika belum diberikan; ajukan pertanyaan.`;
export async function askAI(workspace: Workspace, userText: string, history: { role: 'user' | 'assistant'; text: string }[]) {
  const setting = await db.settings.get('local');
  if (!setting?.aiApiKey) throw new Error('Tambahkan API key AI terlebih dahulu di Pengaturan.');
  const command = userText.trim().split(/\s+/)[0].toLowerCase();
  const brief = await db.briefs.where('workspaceId').equals(workspace.id).first();
  const latestBudget = await db.budgets.where('workspaceId').equals(workspace.id).reverse().sortBy('createdAt').then(rows => rows[0]);
  const allocations = latestBudget ? await db.allocations.where('budgetPlanId').equals(latestBudget.id).toArray() : [];
  const context = { workspace: { name: workspace.name, industry: workspace.industry, brandVoice: workspace.brandVoice, products: workspace.products, businessTarget: workspace.businessTarget }, brief, budget: latestBudget ? { ...latestBudget, allocations } : null };
  const commandHint = ['/brief', '/budget'].includes(command) ? `Perintah pengguna ${command}. Keluarkan JSON untuk modul ${command.slice(1)} jika informasi cukup; jika belum, ajukan maksimal 5 pertanyaan.` : '';
  const endpoint = setting.aiEndpoint.replace(/\/$/, '');
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${setting.aiApiKey}` }, body: JSON.stringify({ model: setting.aiModel, temperature: 0.6, messages: [{ role: 'system', content: SYSTEM_TEMPLATE.replace('[NAMA_WORKSPACE]', workspace.name).replace('[INDUSTRI]', workspace.industry).replace('[BRAND_VOICE]', workspace.brandVoice).replace('[TARGET]', workspace.businessTarget) + `\nKONTEKS WORKSPACE AKTIF (gunakan hanya ini): ${JSON.stringify(context)}\n${commandHint}` }, ...history.slice(-12).map(m => ({ role: m.role, content: m.text })), { role: 'user', content: userText }] }) });
  if (!response.ok) throw new Error(`API AI gagal (${response.status}): ${(await response.text()).slice(0, 250)}`);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Respons AI kosong atau format API tidak kompatibel.');
  const match = text.match(/<JSON>\s*([\s\S]*?)\s*<\/JSON>/i) ?? text.match(/```json\s*([\s\S]*?)```/i);
  let card;
  if (match) { try { const parsed = JSON.parse(match[1]); if (['brief', 'budget'].includes(parsed.module) && parsed.payload) card = parsed; } catch { /* malformed AI JSON stays as plain text */ } }
  return { text: text.replace(/<JSON>[\s\S]*?<\/JSON>/i, '').replace(/```json[\s\S]*?```/i, '').trim() || 'Saya sudah menyiapkan rancangan terstruktur.', card };
}
