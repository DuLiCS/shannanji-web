export function formatYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7).replace('-', '.');
}

export function formatFullDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatFullDateCN(date: Date): string {
  const [y, m, d] = date.toISOString().slice(0, 10).split('-');
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`;
}

export function formatDateEn(date: Date): string {
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [y, m, d] = date.toISOString().slice(0, 10).split('-');
  return `${parseInt(d)} ${M[parseInt(m) - 1]} ${y}`;
}
