import { inject, Injectable, Signal, signal } from '@angular/core';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';
import { HttpClient } from '@angular/common/http';
import { ITask } from '../app/interfaces/task.interface';
import { TaskAdapterService } from './task.adapter.service';

@Injectable({
  providedIn: 'root',
})
export class TimeFrameAdapterService {
  http = inject(HttpClient);
  taskService = inject(TaskAdapterService)

  timeFrames = signal<ITimeFrame[]>([]);
  frameInProgress = signal<ITimeFrame | null>(null)
  selectedTimeFrame = signal<ITimeFrame | null>(null);

  constructor() {
    // Initialize frameInProgress asynchronously
    this.getTimeFrames().then((frames) => {
      if (frames && frames.length > 0) {
        this.frameInProgress.set(frames[0]);
        this.selectedTimeFrame.set(frames[0]);
      }
    });
  }

  getTimeFrames(startDate?: Date, endDate?: Date): Promise<ITimeFrame[]> {
    return new Promise<ITimeFrame[]>((resolve, reject) => {
      const baseUrl = 'http://localhost:3000/api/timeFrames';
      const queryParams = startDate && endDate ? `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}` : '';
      this.http
        .get<{ message: string; timeFrames: ITimeFrame[] }>(
          `${baseUrl}${queryParams}`
        )
        .subscribe({
          next: (response) => {
            console.log('Fetched time frames:', response);
            
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

  addTaskToTimeFrame(_id: string, year: number, index: number) {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<{ message: string, timeFrame: ITimeFrame, task: ITask }>(
          `http://localhost:3000/api/timeFrames/${year}/${index}`,
          { taskId: _id }
        )
        .subscribe({
          next: (response) => {
            console.log('Task added to time frame:', response);
            response.timeFrame.startDate = new Date(response.timeFrame.startDate);
            response.timeFrame.endDate = new Date(response.timeFrame.endDate);
            //handle timeFrame update
            this.timeFrames.update(old=>old.map((timeFrame)=>timeFrame.index === index ? response.timeFrame : timeFrame));

            //Update selectedTimeFrame if required
            if (this.selectedTimeFrame()?.index === response.timeFrame.index) {
              this.selectedTimeFrame.set(response.timeFrame);
            }

            //Handle task update
            this.taskService.tasks$.next(

              this.taskService.tasks$.value.map((task) => 
                task._id === response.task._id ? response.task : task
              )
            );

            resolve();
          },
          error: (error) => {
            console.error('Error adding task to time frame:', error);
            reject(error);
          },
        });
    });
    
  }

  async selectNextTimeFrame(): Promise<void> {
    const nextFrame = await this.getNextTimeFrame(this.selectedTimeFrame()!);
    this.selectedTimeFrame.set(nextFrame);
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
            this.timeFrames.update((old) => {
              if (!old.find((item) => item.startDate.getFullYear() === timeFrame.startDate.getFullYear() && item.index === timeFrame.index)) {
                return [...old, timeFrame];
              }
              return [...old];
            });
            resolve(timeFrame);
          },
          error: (error) => {
            console.error('Error fetching next time frame:', error);
            reject(error);
          },
        });
    });
  }

  getPreviousTimeFrame(currentFrame: ITimeFrame): Promise<ITimeFrame | null> {
    return new Promise<ITimeFrame | null>((resolve, reject) => {
      this.http
        .get<{ message: string; timeFrame: ITimeFrame }>(
          `http://localhost:3000/api/timeFrames/previous?currentStartDate=${currentFrame.startDate.toISOString()}&currentEndDate=${currentFrame.endDate.toISOString()}`
        )
        .subscribe({
          next: (response) => {
            console.log('Fetched next time frame:', response);
            const timeFrame = {
              ...response.timeFrame,
              startDate: new Date(response.timeFrame.startDate),
              endDate: new Date(response.timeFrame.endDate),
            };
             this.timeFrames.update((old) => {
              if (!old.find((item) => item.startDate.getFullYear() === timeFrame.startDate.getFullYear() && item.index === timeFrame.index)) {
                return [...old, timeFrame];
              }
              return [...old];
            });
            resolve(timeFrame);
          },
          error: (error) => {
            console.error('Error fetching next time frame:', error);
            reject(error);
          },
        });
    });
  }

  async selectPreviousTimeFrame(): Promise<void> {
    const previousTimeFrame = await this.getPreviousTimeFrame(this.selectedTimeFrame()!);
    this.selectedTimeFrame.set(previousTimeFrame);
  }
}
