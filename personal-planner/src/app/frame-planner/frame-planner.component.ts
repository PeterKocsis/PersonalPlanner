import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ITimeRange } from '../interfaces/time-range.interface';
import { AppStateService } from '../../services/app-state.service';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { TaskListItemComponent } from '../task/task-list-item/task-list-item.component';
import { TimeFrameAdapterService } from '../../adapters/time-frame.adapter.service';
import { ITask } from '../interfaces/task.interface';
import { ITimeSlot } from '../interfaces/time-slot';
import { computeMsgId } from '@angular/compiler';
import { RangeSelectorComponent } from '../range-selector/range-selector.component';

@Component({
  selector: 'app-frame-planner',
  imports: [TaskListItemComponent, RangeSelectorComponent],
  templateUrl: './frame-planner.component.html',
  styleUrl: './frame-planner.component.scss',
})
export class FramePlannerComponent {
  private readonly rowHeight = 60; // px per hour

  appStateService = inject(AppStateService);
  frameAdapterService = inject(TimeFrameAdapterService);

  selectedRange = input.required<ITimeRange>();

  targetRange = signal<ITimeRange | undefined>(undefined);

  availablyDaySchedules = computed(() => {
    return this.appStateService
      .settings()
      ?.frameSettings.availability.dailyAvailabilities.filter((day) => {
        return day.isAvailable;
      });
  });

  displayedFrameRanges = computed(() => {
    const availabilities = this.availablyDaySchedules();
    if (!availabilities?.length) return undefined;

    const allSlots = availabilities.flatMap((day) => day.timeSlots);
    const minSlot = allSlots.reduce((min, slot) =>
      slot.start.hour * 60 + slot.start.minutes <
      min.start.hour * 60 + min.start.minutes
        ? slot
        : min
    );
    const maxSlot = allSlots.reduce((max, slot) =>
      slot.end.hour * 60 + slot.end.minutes >
      max.end.hour * 60 + max.end.minutes
        ? slot
        : max
    );

    const result = { ...minSlot, end: maxSlot.end };
    console.log('Calculated frame ranges:', result);
    return result;
  });

  displayedFrameHeight = computed((): number => {
    const frameRange = this.displayedFrameRanges();
    if (frameRange === undefined) {
      return 0;
    }
    return (
      ((frameRange.end.hour * 60 +
        frameRange.end.minutes -
        frameRange.start.hour * 60 +
        frameRange.start.minutes) /
        60) *
      this.rowHeight
    ); // 30px per hour
  });

  timeScaleMarkers = computed(() => {
    const frameRange = this.displayedFrameRanges();
    if (!frameRange) return [];

    const hourlyMarkers = this.range(
      frameRange.start.hour + 1,
      frameRange.end.hour + 1,
      1
    );
    const frameRangeStartMinutes =
      frameRange.start.hour * 60 + frameRange.start.minutes;
    return hourlyMarkers.map((hour) => {
      const hourInMinutes = hour * 60;
      const adjustedHour = hourInMinutes - frameRangeStartMinutes;
      return {
        hour: hour,
        top: (adjustedHour / 60) * this.rowHeight, // 30px per hour
        label: `${hour.toString().padStart(2, '0')}:00`,
      };
    });
  });

  displayDailyTimeSlots = computed(() => {
    const availabilities = this.availablyDaySchedules();
    const displayedFrameHeight = this.displayedFrameHeight();
    const frameRange = this.displayedFrameRanges();
    if (!availabilities?.length) return undefined;

    return availabilities.map((day, index) => {
      const slots = day.timeSlots.map((slot: ITimeSlot) => {
        const startMinutes = slot.start.hour * 60 + slot.start.minutes;
        const endMinutes = slot.end.hour * 60 + slot.end.minutes;
        const duration = endMinutes - startMinutes;

        // Calculate the vertical position based on the start time
        const topPosition =
          ((startMinutes -
            (frameRange!.start.hour * 60 + frameRange!.start.minutes)) /
            60) *
          this.rowHeight; // 30px per hour
        const height = (duration / 60) * this.rowHeight; // 30px per hour

        return {
          top: topPosition,
          height: height,
        };
      });
      return {
        dayName: this.getDayName(index),
        slots: slots,
      };
    });
  });

  range(start: number, end: number, step: number = 1): number[] {
    if (step <= 0) {
      throw new Error('Step must be a positive number.');
    }
    return Array.from(
      { length: Math.ceil((end - start) / step) },
      (_, i) => start + i * step
    );
  }

  //TODO!! Match index with the day index of the Date object
  getDayName(index: number): string {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return days[index % 7];
  }

  selectedTimeFrame = computed((): ITimeFrame | undefined => {
    const targetRange = this.targetRange();
    // Find the time frame that matches the selected range
    const targetFrame = this.appStateService.timeFrames().find((timeFrame) => {
      if(targetRange) {
        const targetFrame =
          timeFrame.year === targetRange.year &&
          timeFrame.index === targetRange.index;
        if (!targetFrame) {
          return false;
        }
        console.log('Found matching time frame:', timeFrame);
        return true;
      }
      return false;
    });
    console.log('Selected time frame:', targetFrame);
    return targetFrame;
  });

  pocketsTasks = computed((): ITask[] => {
    const tasks = this.appStateService.tasks();
    const selectedFrame = this.selectedTimeFrame();
    return tasks.filter((t) => {
      // Filter tasks that are assigned to the selected time frame
      return selectedFrame?.pocketsTasks.includes(t._id);
    });
  });

  onRangeChange(ranges: ITimeRange[]) {
    // Update the selected range when the range selector emits a change
    if (ranges.length > 0) {
      this.targetRange.set(ranges[0]);
    }
    
  }

  constructor() {
    // Effect to fetch the frame by the selected range whenever it changes
    effect(() => {
      const targetRange = this.targetRange();
      if (!targetRange) return;
      this.frameAdapterService.getFrameByRange(targetRange);
    });

    effect(() => {
      const initialRange = this.selectedRange();
      if (initialRange) {
        this.targetRange.set(initialRange);
      }
    });
  }
}
