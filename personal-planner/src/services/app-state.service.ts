import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';
import { TaskAdapterService } from '../adapters/task.adapter.service';
import { SpacesService } from '../adapters/spaces.service';
import { merge, Subscription } from 'rxjs';
import { TimeFrameAdapterService } from '../adapters/time-frame.adapter.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService implements OnDestroy {
  tasks = signal<any[]>([]);
  spaces = signal<any[]>([]);
  timeRanges = signal<any[]>([]);
  currentWeekRange = signal<any | null>(null);
  timeFrames = signal<ITimeFrame[]>([]);

  private _taskAdapterService = inject(TaskAdapterService);
  private _timeFrameAdapterService = inject(TimeFrameAdapterService);
  private _spacesService = inject(SpacesService);

  private subscribtions: Subscription[] = [];

  constructor() {
    this.subscribtions.push(
      this._taskAdapterService.tasks$.subscribe((tasks) => {
        this.tasks.set(tasks);
      }),

      this._taskAdapterService.taskEvents$.subscribe((event) => {
        switch (event.type) {
          case 'taskAdded':
          case 'taskUpdated':
          case 'taskAssignedToSpace':
            if (event.task.assignedTimeRange) {
              this._timeFrameAdapterService.getFrameByRange(event.task.assignedTimeRange) 
            }
          }
      }),

      // this._spacesService.spaces$.subscribe((spaces) => {
      //   this.spaces.set(spaces);
      // }),

      this._timeFrameAdapterService.timeFrames$.subscribe((timeFrames) => {
        this.timeFrames.set(timeFrames);
      })
    );

    // Initialize current week range
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    this.currentWeekRange.set({ start: startOfWeek, end: endOfWeek });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscribtions.forEach((sub) => sub.unsubscribe());
  }
}
