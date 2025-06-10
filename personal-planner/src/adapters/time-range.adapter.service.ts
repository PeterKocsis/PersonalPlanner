import { inject, Injectable } from '@angular/core';
import { ITimeRange } from '../app/interfaces/time-range.interface';
import { HttpClient } from '@angular/common/http';
import { IBackendTimeRange } from './backend.interfaces/backend-time-range.interface';

@Injectable({
  providedIn: 'root',
})
export class TimeRangeAdapterService {
  private http = inject(HttpClient);

  constructor() {}

  getDateRangeByIndex(year?: number, index?: number): Promise<ITimeRange> {
    return new Promise<ITimeRange>((resolve, reject) => {
      this.http
        .get<{ message: string; timeRange: IBackendTimeRange }>(
          `http://localhost:3000/api/time-range/byIndex?year=${year}&index=${index}`
        )
        .subscribe({
          next: (response) => {
            const resultTimeRange: ITimeRange = {
              ...response.timeRange,
            };
            resolve(resultTimeRange);
          },
          error: (error) => {
            console.error(
              `Failed to get time range for ${year} and ${index}`,
              error
            );
            reject(error);
          },
        });
    });
  }

  getDateRange(startDate: Date, endDate: Date): Promise<ITimeRange> {
    return new Promise<ITimeRange>((resolve, reject) => {
      this.http
        .get<{ message: string; timeRange: IBackendTimeRange }>(
          `http://localhost:3000/api/time-range?startDate=${startDate}&endDate=${endDate}`
        )
        .subscribe({
          next: (response) => {
            const resultTimeRange: ITimeRange = {
              ...response.timeRange,
            };
            resolve(resultTimeRange);
          },
          error: (error) => {
            console.error(
              `Failed to get time ranges for the following start date: ${startDate} and for end date: ${endDate}`,
              error
            );
            reject(error);
          },
        });
    });
  }
}
