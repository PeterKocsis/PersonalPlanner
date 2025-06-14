import { __String } from 'typescript';

export interface IBackendTimeRange {
  year: number;
  index: number;
  startDate: string;
  endDate: string;
}

export function isBackendTimeRange(data: unknown): data is IBackendTimeRange {
  return (
    (typeof data === 'object') &&
    (data !== null) &&
    ('year' in data) &&
    ('index' in data) &&
    ('startDate' in data) &&
    ('endDate' in data)
    // (typeof (data as IBackendTimeRange).year === 'number') &&
    // (typeof (data as IBackendTimeRange).index === 'number') &&
    // (typeof (data as IBackendTimeRange).startDate === 'string') &&
    // (typeof (data as IBackendTimeRange).endDate === 'string')
  );
}

export function isBackendTimeRangeArray(data: unknown): data is IBackendTimeRange[] {
  return (
    Array.isArray(data) &&
    data.every((item) => isBackendTimeRange(item))
  );
} 
