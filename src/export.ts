import * as XLSX from 'xlsx';
import { download, rupiah, type Allocation, type BudgetPlan, type Workspace } from './db';
export function exportBudgetExcel(workspace: Workspace, plan: BudgetPlan, allocations: Allocation[]) {
  const allocated = allocations.reduce((sum, item) => sum + plan.totalBudgetRp * item.percentage / 100, 0);
  const summary = [['Rancangan Anggaran Marketing'], ['Perusahaan', workspace.name], ['Industri', workspace.industry], ['Periode', `${plan.periodStart || '-'} – ${plan.periodEnd || '-'}`], ['Total budget', plan.totalBudgetRp], ['Total alokasi', allocated], ['Sisa budget', plan.totalBudgetRp - allocated], ['Catatan', 'Nominal dihitung aplikasi dari persentase alokasi. Estimasi hasil merupakan usulan, bukan hasil aktual.']];
  const detail = [['Channel', 'Jenis', 'Alokasi (%)', 'Nominal (Rp)', 'Estimasi hasil', 'Catatan'], ...allocations.map(a => [a.channel, a.type, a.percentage, Math.round(plan.totalBudgetRp * a.percentage / 100), a.estimatedResults, a.notes])];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), 'Ringkasan'); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(detail), 'Rincian Alokasi');
  const bytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); download(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `anggaran-${workspace.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.xlsx`);
}
