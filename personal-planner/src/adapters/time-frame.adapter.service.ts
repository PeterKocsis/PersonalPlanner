import { inject, Injectable, signal } from '@angular/core';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TimeFrameAdapterService {
  http = inject(HttpClient);

  timeFrames = signal<ITimeFrame[]>([]);
  selectedTimeFrame = signal<ITimeFrame | null>(null);

  constructor() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.getTimeFrames(startOfMonth, endOfMonth).then((timeFrames) => {
      this.timeFrames.set(timeFrames);
    });
    // this.getTimeFrames(today, today).then((timeFrames) => {
    //   this.selectedTimeFrame.set(timeFrames[0]);
    // });
    this.getCurrentTimeFrame().then((timeFrame) => {
      if (timeFrame) {
        this.selectedTimeFrame.set(timeFrame);
      } else {
        // Fallback to the first time frame of the current month
        const firstTimeFrame = this.timeFrames()[0];
        if (firstTimeFrame) {
          this.selectedTimeFrame.set(firstTimeFrame);
        }
      }
    });
  }

  getTimeFrames(startDate: Date, endDate: Date): Promise<ITimeFrame[]> {
    return new Promise<ITimeFrame[]>((resolve, reject) => {
      this.http
        .get<{ message: string; timeFrames: ITimeFrame[] }>(
          `http://localhost:3000/api/timeFrames?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )
        .subscribe({
          next: (response) => {
            console.log('Fetched time frames:', response);
            // this.cacheTimeFrames(response.timeFrames);
            this.timeFrames.set(
              response.timeFrames.map((timeFrame) => ({
                ...timeFrame,
                startDate: new Date(timeFrame.startDate),
                endDate: new Date(timeFrame.endDate),
              }))
            );
            resolve(
              response.timeFrames.map((timeFrame) => ({
                ...timeFrame,
                startDate: new Date(timeFrame.startDate),
                endDate: new Date(timeFrame.endDate),
              }))
            );
          },
          error: (error) => {
            console.error('Error fetching time frames:', error);
            reject(error);
          },
        });
    });
  }


  getCurrentTimeFrame(): Promise<ITimeFrame | null> {
    return new Promise<ITimeFrame | null>((resolve, reject) => {
      this.http
        .get<{ message: string; timeFrame: ITimeFrame }>(
          'http://localhost:3000/api/timeFrames/current'
        )
        .subscribe({
          next: (response) => {
            console.log('Fetched current time frame:', response);
            const timeFrame = {
              ...response.timeFrame,
              startDate: new Date(response.timeFrame.startDate),
              endDate: new Date(response.timeFrame.endDate),
            };
            resolve(timeFrame);
          },
          error: (error) => {
            console.error('Error fetching current time frame:', error);
            reject(error);
          },
        });
    });
  }

  async selectNextTimeFrame(relativeTo: ITimeFrame): Promise<void> {
    const nextFrame = this.timeFrames().find((timeFrame) => {
      const diffInDays =
        (timeFrame.startDate.getTime() - relativeTo.startDate.getTime()) /
        1000 /
        3600 /
        24;
      if (diffInDays > 0 && diffInDays < 2) return true;
      return false;
    });
    if (nextFrame) {
      this.selectedTimeFrame.set(nextFrame);
    } else {
      const nextFrame = await this.getNextTimeFrame(relativeTo);
      this.selectedTimeFrame.set(nextFrame);
    }
  }

  getNextTimeFrame(currentFrame: ITimeFrame): Promise<ITimeFrame | null> {
    return new Promise<ITimeFrame | null>((resolve, reject) => {
      this.http
        .get<{ message: string; timeFrame: ITimeFrame }>(
          `http://localhost:3000/api/timeFrames/next?currentStartDate=${currentFrame.startDate.toISOString()}&currentEndDate=${currentFrame.endDate.toISOString()}`
        )
        .subscribe({
          next: (response) => {
            console.log('Fetched next time frame:', response);
            const timeFrame = {
              ...response.timeFrame,
              startDate: new Date(response.timeFrame.startDate),
              endDate: new Date(response.timeFrame.endDate),
            };
            resolve(timeFrame);
          },
          error: (error) => {
            console.error('Error fetching next time frame:', error);
            reject(error);
          },
        });
    });
  }

  async selectPreviousTimeFrame(relativeTo: ITimeFrame): Promise<void> {
    const previousFrame = this.timeFrames().find((timeFrame) => {
      const diffInDays =
        (relativeTo.startDate.getTime() - timeFrame.startDate.getTime()) /
        1000 /
        3600 /
        24;
      if (diffInDays > 0 && diffInDays < 2) return true;
      return false;
    });
    if (previousFrame) {
      this.selectedTimeFrame.set(previousFrame);
    } else {
      // fetch previous time frame
      const startDate = new Date(relativeTo.startDate);
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date(relativeTo.startDate);
      endDate.setDate(relativeTo.startDate.getDate() - 1);
      const timeFrames = await this.getTimeFrames(startDate, endDate);
      this.selectedTimeFrame.set(timeFrames[0]);
    }
  }
}
