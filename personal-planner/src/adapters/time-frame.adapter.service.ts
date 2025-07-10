import { inject, Injectable } from '@angular/core';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { ITimeRange } from '../app/interfaces/time-range.interface';

@Injectable({
  providedIn: 'root',
})
export class TimeFrameAdapterService {
  http = inject(HttpClient);
  timeFrames$ = new BehaviorSubject<ITimeFrame[]>([]);

  getTimeFrames(startDate?: Date, endDate?: Date): void {
    const baseUrl = 'http://localhost:3000/api/timeFrames';
    const queryParams =
      startDate && endDate
        ? `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        : '';
    this.http
      .get<{ message: string; timeFrames: ITimeFrame[] }>(
        `${baseUrl}${queryParams}`
      )
      .pipe(
        map((response) => {
          return response.timeFrames.map((timeFrame) => ({
            ...timeFrame,
            startDate: new Date(timeFrame.startDate),
            endDate: new Date(timeFrame.endDate),
          }));
        })
      )
      .subscribe({
        next: (timeFrames) => {
          console.log('Fetched time frames:', timeFrames);
          const previous = this.timeFrames$.value;
          const mergedFrames: ITimeFrame[] = [...timeFrames];
          previous.forEach((existingFrame) => {
            if (
              !mergedFrames.find(
                (frame) =>
                  frame.index === existingFrame.index &&
                  frame.year === existingFrame.year
              )
            ) {
              mergedFrames.push(existingFrame);
            }
          });
          mergedFrames.sort(
            (a, b) => a.startDate.getTime() - b.startDate.getTime()
          );

          this.timeFrames$.next(mergedFrames);
        },
        error: (error) => {
          console.error('Error fetching time frames:', error);
        },
      });
  }

  getFrameByRange(range: ITimeRange): void {
    const startDate = new Date(range.startDate);
    const endDate = new Date(range.endDate);

    this.getTimeFrames(startDate, endDate);
  }

  getFramesByRanges(ranges: ITimeRange[]): void {
    if (!ranges || ranges.length === 0) {
      this.timeFrames$.next([]);
      return;
    }

    const startDate = new Date(
      Math.min(...ranges.map((r) => r.startDate.getTime()))
    );
    const endDate = new Date(
      Math.max(...ranges.map((r) => r.endDate.getTime()))
    );

    this.getTimeFrames(startDate, endDate);
  }
}
