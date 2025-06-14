import { inject, Injectable, Signal, signal } from '@angular/core';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';
import { HttpClient } from '@angular/common/http';
import { ITask } from '../app/interfaces/task.interface';
import { TaskAdapterService } from './task.adapter.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeFrameAdapterService {
  http = inject(HttpClient);
  taskService = inject(TaskAdapterService)

  timeFrames = signal<ITimeFrame[]>([]);

  constructor() {
    // Initialize frameInProgress asynchronously
    this.getTimeFrames();
  }

  getTimeFrames(startDate?: Date, endDate?: Date): Promise<ITimeFrame[]> {
    return new Promise<ITimeFrame[]>((resolve, reject) => {
      const baseUrl = 'http://localhost:3000/api/timeFrames';
      const queryParams = startDate && endDate ? `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}` : '';
      this.http
        .get<{ message: string; timeFrames: ITimeFrame[] }>(
          `${baseUrl}${queryParams}`
        )
        .pipe(
          map((response)=>{
            return  response.timeFrames.map((timeFrame) => ({
                ...timeFrame,
                startDate: new Date(timeFrame.startDate),
                endDate: new Date(timeFrame.endDate),
              }))
          })
        )
        .subscribe({
          next: (timeFrames) => {
            console.log('Fetched time frames:', timeFrames);

            this.timeFrames.update((previous)=>{
              const mergedFrames: ITimeFrame[] = [...timeFrames];
              previous.forEach((existingFrame) => {
                if (!mergedFrames.find((frame) => frame.index === existingFrame.index && frame.year === existingFrame.year)) {
                  mergedFrames.push(existingFrame);
                }
              });
              return mergedFrames.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
            });
            resolve(timeFrames);
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
}
