import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-frame-browser',
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
    RangeSelectorComponent,
  ],
  templateUrl: './frame-browser.component.html',
  styleUrl: './frame-browser.component.scss',
})
export class FrameBrowserComponent {
  timeFrameService = inject(TimeFrameAdapterService);
  appStateService = inject(AppStateService);
  timeFrames = this.appStateService.timeFrames;
  selectedTimeRanges = signal<ITimeRange[]>([]);
  selectedTimeFrames = computed(() => {
    return this.appStateService.timeFrames().filter((frame) => {
      return this.selectedTimeRanges().some(
        (range) => range.year === frame.year && range.index === frame.index
      );
    });
  });

  onSelectedRangeChanged(selectedRanges: ITimeRange[]) {
    this.selectedTimeRanges.set(selectedRanges);
    this.timeFrameService.getFramesByRanges(selectedRanges);
  }
}
