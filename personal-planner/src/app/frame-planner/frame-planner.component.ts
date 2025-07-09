import { Component, input } from '@angular/core';
import { ITimeRange } from '../interfaces/time-range.interface';

@Component({
  selector: 'app-frame-planner',
  imports: [],
  templateUrl: './frame-planner.component.html',
  styleUrl: './frame-planner.component.scss'
})
export class FramePlannerComponent {
  selectedRange = input.required<ITimeRange>();

}

