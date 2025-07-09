import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { AppStateService } from '../../services/app-state.service';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ITimeRange } from '../interfaces/time-range.interface';
import { TimeRangeAdapterService } from '../../adapters/time-range.adapter.service';

@Component({
  selector: 'app-time-frame-viewer',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './time-frame-viewer.component.html',
  styleUrl: './time-frame-viewer.component.scss',
})
export class TimeFrameViewerComponent {
  timeFrame = input.required<ITimeFrame>();
  appStateService = inject(AppStateService);
  router = inject(Router);

  test = computed(() => {
    const timeFrameStatistics: {
      spaceName: string;
      taskDuration: number;
      spaceAvailability: number;
    }[] = [];
    this.appStateService.spaces().forEach((space) => {
      let spaceTaskDuration = 0;
      const spaceBalance = this.appStateService
        .settings()
        ?.frameSettings.balances.find(
          (balance) => balance.spaceId === space._id
        );
      const spaceAvailability = spaceBalance?.assignedTimePerFrame || 0;
      this.timeFrame().pocketsTasks.forEach((task) => {
        if (task.spaceId === space._id) {
          spaceTaskDuration += task.timeToCompleteMinutes || 0;
        }
      });
      timeFrameStatistics.push({
        spaceName: space.displayName,
        taskDuration: spaceTaskDuration,
        spaceAvailability: spaceAvailability,
      });
    });
    return timeFrameStatistics;
  });

  onOpenPlanner() {
    this.router.navigate(['/frame-planner'], {
      queryParams: {
        start: this.timeFrame().startDate.toISOString(),
        end: this.timeFrame().endDate.toISOString(),
      },
    });
  }
}

export const resolveSelectedRange: ResolveFn<ITimeRange> =  async(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const timeRangeService = inject(TimeRangeAdapterService);
  const start = route.queryParamMap.get('start');
  const end = route.queryParamMap.get('end');
  if (start && end) {
    const range = await timeRangeService.getTimeRanges(new Date(start), new Date(end))
    return range[0];
  }
  return await timeRangeService.getCurrentWeekRange();
};
