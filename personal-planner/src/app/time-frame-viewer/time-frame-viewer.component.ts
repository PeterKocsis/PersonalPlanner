import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { SpacesService } from '../../adapters/spaces.service';

@Component({
  selector: 'app-time-frame-viewer',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './time-frame-viewer.component.html',
  styleUrl: './time-frame-viewer.component.scss',
})
export class TimeFrameViewerComponent {
  timeFrame = input.required<ITimeFrame>();
  spaceService = inject(SpacesService);

  test = computed(() => {
    const timeFrameStatistics: {spaceName: string, taskDuration: number}[] = [];
    this.spaceService.spaces().forEach((space) => {
      let spaceTaskDuration = 0;
      this.timeFrame().pocketsTasks.forEach((task) => {
        if (task.spaceId === space._id) {
          spaceTaskDuration += task.timeToCompleteMinutes || 0;
        }
      });
      timeFrameStatistics.push({
        spaceName: space.displayName,
        taskDuration: spaceTaskDuration
      })
    });
    return timeFrameStatistics;
  });
}
