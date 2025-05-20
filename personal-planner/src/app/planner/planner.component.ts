import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MonthSelectorComponent } from '../month-selector/month-selector.component';
import { ITimeFrame } from '../interfaces/week.interface';
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

  onDateChanged(date: Date) {
    this.weeksOfMonth = this.timeFrameService.getWeeksofMonth(
      date.getFullYear(),
      date.getMonth()
    );
  }
  dateOfToday: Date = new Date();
  weeksOfYear: ITimeFrame[] = [];
  weeksOfMonth: ITimeFrame[] = [];
  constructor() {
    this.weeksOfMonth = this.timeFrameService.getWeeksofMonth(
      this.dateOfToday.getFullYear(),
      this.dateOfToday.getMonth()
    );
  }

}
