export const BRITES_NIGHT_ERROR = 'Brites de Albuquerque apenas plantão diurno.';
export function shiftPrice(company: string, date: string, period: string | null | undefined): number | null {
  if (company === 'Remoções avulsas') return null;
  if (company === 'Hospital Brites de Albuquerque' && period === 'Noturno') throw new Error(BRITES_NIGHT_ERROR);
  if (period !== 'Diurno' && period !== 'Noturno') throw new Error('Selecione DIURNO ou NOTURNO.');
  const day = new Date(date + 'T12:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0,10) !== date) throw new Error('Informe uma data válida.');
  if (company === 'Hospital Brites de Albuquerque') return 137500;
  if (company === 'Safety Med') return period === 'Noturno' || day.getUTCDay() === 0 || day.getUTCDay() === 6 ? 120018 : 115017;
  throw new Error('Empresa inválida.');
}
