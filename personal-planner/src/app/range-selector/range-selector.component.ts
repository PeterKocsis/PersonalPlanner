import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ITimeRange } from '../interfaces/time-range.interface';
import { TimeRangeAdapterService } from '../../adapters/time-range.adapter.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export type TimeUnit = 'week' | 'month';

@Component({
  selector: 'app-range-selector',
  imports: [MatButtonModule, MatIconModule, MatInputModule, CommonModule],
  templateUrl: './range-selector.component.html',
  styleUrl: './range-selector.component.scss',
})
export class RangeSelectorComponent implements OnInit {
  timeUnit = input.required<TimeUnit>();
  timeRangeAdapterService = inject(TimeRangeAdapterService);
  selectedRanges = signal<ITimeRange[]>([]);
  currentRanges = signal<ITimeRange[]>([]);

  selectionChanged = output<ITimeRange[]>();

  ngOnInit(): void {
    this.current();
  }

  async next() {
    if (this.timeUnit() === 'week') {
      const nextRanges = await this.timeRangeAdapterService.getNextWeekRange(
        this.selectedRanges()[0].endDate
      );
      this.selectedRanges.set([nextRanges]);
      this.selectionChanged.emit([nextRanges]);
    }
    if (this.timeUnit() === 'month') {
      const nextRanges = await this.timeRangeAdapterService.getNextMonthRange(
        this.selectedRanges()[0].endDate
      );
      this.selectedRanges.set(nextRanges);
      this.selectionChanged.emit(nextRanges);
    }
  }
  async previous() {
    if (this.timeUnit() === 'week') {
      const previousRanges =
        await this.timeRangeAdapterService.getPreviousWeekRange(
          this.selectedRanges()[0].startDate
        );
      this.selectedRanges.set([previousRanges]);
      this.selectionChanged.emit([previousRanges]);
    }
    if (this.timeUnit() === 'month') {
      const previousRanges =
        await this.timeRangeAdapterService.getPreviousMonthRange(
          this.selectedRanges()[0].endDate
        );
      this.selectedRanges.set(previousRanges);
      this.selectionChanged.emit(previousRanges);
    }
  }

  async current() {
    if (!this.selectedRanges().length) {
      if (this.timeUnit() === 'week') {
        const currentWeekRange =
          await this.timeRangeAdapterService.getCurrentWeekRange();
        this.currentRanges.set([currentWeekRange]);
        this.selectedRanges.set([currentWeekRange]);
      } else if (this.timeUnit() === 'month') {
        const currentMonthRange =
          await this.timeRangeAdapterService.getCurrentMonthRange();
        this.currentRanges.set(currentMonthRange);
        this.selectedRanges.set(currentMonthRange);
      }
    }
    this.selectionChanged.emit(this.currentRanges());
  }

  async resetSelectedDate() {
    this.selectedRanges.set(this.currentRanges());
    this.selectionChanged.emit(this.currentRanges());
  }

  isCurrentTimeSelected = computed((): boolean => {
    if (
      this.selectedRanges().length > 0 &&
      this.selectedRanges()[0].index === this.currentRanges()[0].index
    ) {
      return true;
    }
    return false;
  });
}
