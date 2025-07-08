import {
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
import { ActivatedSpaceProviderService } from './activated-space-provider.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService implements OnDestroy {
  tasks = signal<ITask[]>([]);
  spaces = signal<ISpace[]>([]);
  inboxSpace = signal<ISpace | undefined>(undefined);
  timeFrames = signal<ITimeFrame[]>([]);
  settings = signal<ISettings | undefined>(undefined);
  activatedSpaceId = signal<string | null>(null);

  private _authService = inject(AuthService);
  private _taskAdapterService = inject(TaskAdapterService);
  private _timeFrameAdapterService = inject(TimeFrameAdapterService);
  private _settingsAdapterService = inject(SettingsAdapterService);
  private _spacesService = inject(SpacesService);
  private _activatedSpaceProviderService = inject(ActivatedSpaceProviderService);

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
      }),
      this._activatedSpaceProviderService.activatedSpaceId.subscribe((spaceId) => {
        this.activatedSpaceId.set(spaceId);
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
    effect(() => {
      const inboxSpaceId = this.inboxSpace()?._id;
      if (!this.activatedSpaceId() && inboxSpaceId) {
        this.activatedSpaceId.set(inboxSpaceId);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscribtions.forEach((sub) => sub.unsubscribe());
  }
}
