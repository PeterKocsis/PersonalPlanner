import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from '@angular/core';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';
import { TaskAdapterService } from '../adapters/task.adapter.service';
import { SpacesService } from '../adapters/spaces.service';
import { Subscription } from 'rxjs';
import { TimeFrameAdapterService } from '../adapters/time-frame.adapter.service';
import { AuthService } from '../app/auth/auth.service';
import { ITask } from '../app/interfaces/task.interface';
import { ISpace } from '../app/interfaces/space.interface';
import { SettingsAdapterService } from '../adapters/settings-adapter.service';
import { ISettings } from '../app/interfaces/setting.interface';

@Injectable({
  providedIn: 'root',
})
export class AppStateService implements OnDestroy {
  tasks = signal<ITask[]>([]);
  spaces = signal<ISpace[]>([]);
  inboxSpace = signal<ISpace | undefined>(undefined);
  timeFrames = signal<ITimeFrame[]>([]);
  settings = signal<ISettings | undefined>(undefined);
  // totalAvailableTime = computed((): number => {
  //   if (this.settings() === undefined) {
  //     return 0;
  //   }
  //   return this.settings()!.frameSettings.availability.dailyAvailabilities.reduce(
  //     (total, availability) => {
  //       if (availability.isAvailable) {
  //         return (
  //           total +
  //           availability.timeSlots.reduce(
  //             (dayTotal, slot) =>
  //               dayTotal +
  //               (slot.end.hour - slot.start.hour) * 60 +
  //               (slot.end.minutes - slot.start.minutes),
  //             0
  //           )
  //         );
  //       }
  //       return total;
  //     },
  //     0
  //   );
  // });

  // assignableTime = computed((): number => {
  //   if (this.settings() === undefined) {
  //     return 0;
  //   }
  //   return (
  //     this.totalAvailableTime() *
  //     this.settings()!.frameSettings.availability.useRatio
  //   );
  // });

  private _authService = inject(AuthService);
  private _taskAdapterService = inject(TaskAdapterService);
  private _timeFrameAdapterService = inject(TimeFrameAdapterService);
  private _settingsAdapterService = inject(SettingsAdapterService);
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
              this._timeFrameAdapterService.getFrameByRange(
                event.task.assignedTimeRange
              );
            }
        }
      }),

      this._spacesService.spaces$.subscribe((spaces) => {
        this.spaces.set(spaces);
      }),
      this._spacesService.inboxSpace$.subscribe((inbox) => {
        this.inboxSpace.set(inbox);
      }),

      this._timeFrameAdapterService.timeFrames$.subscribe((timeFrames) => {
        this.timeFrames.set(timeFrames);
      }),

      this._settingsAdapterService.settings$.subscribe((settings) => {
        this.settings.set(settings);
      })
    );
    //Fetch initial data on user authentication
    effect(async () => {
      if (this._authService.userAuthenticated()) {
        this._spacesService.getSpaces();
        this._spacesService.getInbox();
        this._taskAdapterService.getAllTask();
        this._settingsAdapterService.getSettingsFromServer();
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscribtions.forEach((sub) => sub.unsubscribe());
  }
}
