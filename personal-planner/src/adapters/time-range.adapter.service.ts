import { inject, Injectable } from '@angular/core';
import { ITimeRange } from '../app/interfaces/time-range.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import {
  IBackendTimeRange,
  isBackendTimeRange,
  isBackendTimeRangeArray,
} from './backend.interfaces/backend-time-range.interface';

@Injectable({
  providedIn: 'root',
})
export class TimeRangeAdapterService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/time-range';

  constructor() {}

  getTimeRanges(startDate?: Date, endDate?: Date): Promise<ITimeRange[]> {
    let queryParams = '';
    if (startDate && endDate) {
      queryParams = `startDate=${
        startDate ? startDate.toISOString() : ''
      }&endDate=${endDate ? endDate.toISOString() : ''}`;
    }

    return firstValueFrom(
      this.http
        .get<{ message: string; timeRanges: IBackendTimeRange[] }>(
          `${this.baseUrl}?${queryParams}`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRangeArray(response.timeRanges)) {
              throw new Error(
                'Invalid time range data format received in getTimeRanges'
              );
            }
            return response.timeRanges.map((tr) => ({
              ...tr,
              startDate: new Date(tr.startDate),
              endDate: new Date(tr.endDate),
            }));
          })
        )
    );
  }

  getCurrentWeekRange(): Promise<ITimeRange> {
    return firstValueFrom(
      this.http
        .get<{ message: string; timeRange: ITimeRange }>(
          `${this.baseUrl}/week/current`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRange(response.timeRange)) {
              throw new Error(
                'Invalid time range data format received in getCurrentWeekRange'
              );
            }
            const weekRange: ITimeRange = {
              ...response.timeRange,
              startDate: new Date(response.timeRange.startDate),
              endDate: new Date(response.timeRange.endDate),
            };
            return weekRange;
          })
        )
    );
  }

  getNextWeekRange(relativeTo: Date): Promise<ITimeRange> {
    return firstValueFrom(
      this.http
        .get<{ message: string; timeRange: ITimeRange }>(
          `${this.baseUrl}/week/next?date=${relativeTo.toISOString()}`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRange(response.timeRange)) {
              throw new Error(
                'Invalid time range data format received in getNextWeekRange'
              );
            }
            const weekRange: ITimeRange = {
              ...response.timeRange,
              startDate: new Date(response.timeRange.startDate),
              endDate: new Date(response.timeRange.endDate),
            };
            return weekRange;
          })
        )
    );
  }

  getPreviousWeekRange(relativeTo: Date): Promise<ITimeRange> {
    return firstValueFrom(
      this.http
        .get<{ message: string; timeRange: ITimeRange }>(
          `${this.baseUrl}/week/previous?date=${relativeTo.toISOString()}`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRange(response.timeRange)) {
              throw new Error(
                'Invalid time range data format received in getPreviousWeekRange'
              );
            }
            const weekRange: ITimeRange = {
              ...response.timeRange,
              startDate: new Date(response.timeRange.startDate),
              endDate: new Date(response.timeRange.endDate),
            };
            return weekRange;
          })
        )
    );
  }

  getCurrentMonthRange(): Promise<ITimeRange[]> {
    return firstValueFrom(
      this.http
        .get<{ message: string; timeRanges: IBackendTimeRange[] }>(
          `${this.baseUrl}/month/current`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRangeArray(response.timeRanges)) {
              throw new Error(
                'Invalid time range data format received in getCurrentMonthRange'
              );
            }
            return response.timeRanges.map((tr) => ({
              ...tr,
              startDate: new Date(tr.startDate),
              endDate: new Date(tr.endDate),
            }));
          })
        )
    );
  }

  getNextMonthRange(relativeTo: Date): Promise<ITimeRange[]> {
    return firstValueFrom(
      this.http
        .get<{ message: string; timeRanges: IBackendTimeRange[] }>(
          `${this.baseUrl}/month/next?date=${relativeTo.toISOString()}`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRangeArray(response.timeRanges)) {
              throw new Error(
                'Invalid time range data format received in getNextMonthRange'
              );
            }
            return response.timeRanges.map((tr) => ({
              ...tr,
              startDate: new Date(tr.startDate),
              endDate: new Date(tr.endDate),
            }));
          })
        )
    );
  }

  getPreviousMonthRange(relativeTo: Date): Promise<ITimeRange[]> {
    return firstValueFrom(
      this.http
        .get<{ message: string; timeRanges: IBackendTimeRange }>(
          `${this.baseUrl}/month/previous?date=${relativeTo.toISOString()}`
        )
        .pipe(
          map((response) => {
            if (!isBackendTimeRangeArray(response.timeRanges)) {
              throw new Error(
                'Invalid time range data format received in getPreviousMonthRange'
              );
            }
            return response.timeRanges.map((tr) => ({
              ...tr,
              startDate: new Date(tr.startDate),
              endDate: new Date(tr.endDate),
            }));
          })
        )
    );
  }
}
