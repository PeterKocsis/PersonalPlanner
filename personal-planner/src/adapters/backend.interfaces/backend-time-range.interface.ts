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
  );
}

export function isBackendTimeRangeArray(data: unknown): data is IBackendTimeRange[] {
  return (
    Array.isArray(data) &&
    data.every((item) => isBackendTimeRange(item))
  );
} 
