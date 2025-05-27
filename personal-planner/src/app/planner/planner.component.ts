import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MonthSelectorComponent } from '../month-selector/month-selector.component';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { TimeFrameViewerComponent } from '../time-frame-viewer/time-frame-viewer.component';
import { TimeFrameAdapterService } from '../../adapters/time-frame.adapter.service';

@Component({
  selector: 'app-planner',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    MonthSelectorComponent,
    TimeFrameViewerComponent,
  ],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent {
  timeFrameService = inject(TimeFrameAdapterService);
  timeFrames = this.timeFrameService.timeFrames;
  dateOfToday = new Date();
  
  onDateChanged(date: Date) {
    const dateRange = this.monthRangeFromDate(date);
    this.timeFrameService.getTimeFrames(dateRange.startOfMonth, dateRange.endOfMonth);
  }
  
  constructor() {
    const dateRange = this.monthRangeFromDate(new Date());
    this.timeFrameService.getTimeFrames(dateRange.startOfMonth, dateRange.endOfMonth);
  }

  private monthRangeFromDate(date: Date): {startOfMonth: Date, endOfMonth: Date} {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );
    return { startOfMonth, endOfMonth };
  }
}
