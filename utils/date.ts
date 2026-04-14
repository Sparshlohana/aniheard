export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isConsecutiveDay(currentDate: string, previousDate?: string | null) {
  if (!previousDate) {
    return false;
  }

  const current = new Date(`${currentDate}T00:00:00.000Z`).getTime();
  const previous = new Date(`${previousDate}T00:00:00.000Z`).getTime();
  const diffInDays = Math.round((current - previous) / 86_400_000);
  return diffInDays === 1;
}
