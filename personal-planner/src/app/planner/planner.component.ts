import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TimeFrameViewerComponent } from '../time-frame-viewer/time-frame-viewer.component';
import { TimeFrameAdapterService } from '../../adapters/time-frame.adapter.service';
import { RangeSelectorComponent } from '../range-selector/range-selector.component';
import { ITimeRange } from '../interfaces/time-range.interface';
import { ITimeFrame } from '../interfaces/time-frame.interface';

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
    TimeFrameViewerComponent,
    RangeSelectorComponent
  ],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent {
  timeFrameService = inject(TimeFrameAdapterService);
  timeFrames = this.timeFrameService.timeFrames;
  selectedTimeFrames = signal<ITimeFrame[]>([]);


  async onSelectedRangeChanged(selectedRanges: ITimeRange[]) {
    const startDate = selectedRanges[0].startDate;
    const endDate = selectedRanges[selectedRanges.length - 1].startDate;
    const result = await this.timeFrameService.getTimeFrames(startDate, endDate);
    this.selectedTimeFrames.set(result);
  }

}
