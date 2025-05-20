import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ITimeFrame } from '../interfaces/week.interface';

@Component({
  selector: 'app-time-frame-viewer',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './time-frame-viewer.component.html',
  styleUrl: './time-frame-viewer.component.scss',
})
export class TimeFrameViewerComponent {
  timeFrame = input.required<ITimeFrame>();
}
