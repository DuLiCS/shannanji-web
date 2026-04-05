export function formatYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7).replace('-', '.');
}

export function formatFullDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
