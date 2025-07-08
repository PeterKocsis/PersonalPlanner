import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-time-frame-viewer',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './time-frame-viewer.component.html',
  styleUrl: './time-frame-viewer.component.scss',
})
export class TimeFrameViewerComponent {
  timeFrame = input.required<ITimeFrame>();
  appStateService = inject(AppStateService);
  
  test = computed(() => {
    const timeFrameStatistics: { spaceName: string; taskDuration: number, spaceAvailability: number }[] =
    [];
    this.appStateService.spaces().forEach((space) => {
      let spaceTaskDuration = 0;
      const spaceBalance = this.appStateService.settings()?.frameSettings.balances.find(
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
    
  }
}
