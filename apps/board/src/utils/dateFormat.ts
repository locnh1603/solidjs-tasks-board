import { DateTime } from 'luxon';

function toDate(input: string | Date | number): Date {
  if (typeof input === 'string') {
    return new Date(input);
  }
  if (input instanceof Date) {
    return input;
  }
  return new Date(input);
}

export function formatDate(date: string | Date | number, format = 'yyyy-MM-dd') {
  return DateTime.fromJSDate(toDate(date)).toFormat(format);
}

export function formatDateTime(date: string | Date | number, format = 'yyyy-MM-dd HH:mm') {
  return DateTime.fromJSDate(toDate(date)).toFormat(format);
}

export function formatRelative(date: string | Date | number) {
  return DateTime.fromJSDate(toDate(date)).toRelative();
}

export function formatISO(date: string | Date | number) {
  return DateTime.fromJSDate(toDate(date)).toISO();
}
