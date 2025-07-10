import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ITimeRange } from '../interfaces/time-range.interface';
import { AppStateService } from '../../services/app-state.service';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { TaskListItemComponent } from '../task/task-list-item/task-list-item.component';
import { TimeFrameAdapterService } from '../../adapters/time-frame.adapter.service';

@Component({
  selector: 'app-frame-planner',
  imports: [TaskListItemComponent],
  templateUrl: './frame-planner.component.html',
  styleUrl: './frame-planner.component.scss'
})
export class FramePlannerComponent {
  appStateService = inject(AppStateService);
  frameAdapterService = inject(TimeFrameAdapterService);

  selectedRange = input.required<ITimeRange>();

  selectedTimeFrame = computed((): ITimeFrame | undefined => {
    // Find the time frame that matches the selected range
    const targetFrame = this.appStateService.timeFrames().find((timeFrame) => {
      const targetFrame = timeFrame.year === this.selectedRange().year && timeFrame.index === this.selectedRange().index;
      if (!targetFrame) {
        return false;
      }
      console.log('Found matching time frame:', timeFrame);
      return true;
    });
    console.log('Selected time frame:', targetFrame);
    return targetFrame;
  });

  constructor() {
    // Effect to fetch the frame by the selected range whenever it changes
    effect(() => {
      this.frameAdapterService.getFrameByRange(this.selectedRange());
    });
  };

}

