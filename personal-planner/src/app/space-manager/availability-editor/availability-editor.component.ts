import { Component, signal } from '@angular/core';
import { DailyTimeSlotEditorComponent, TimeSlot } from '../daily-time-slot-editor/daily-time-slot-editor.component';

@Component({
  selector: 'app-availability-editor',
  imports: [DailyTimeSlotEditorComponent],
  templateUrl: './availability-editor.component.html',
  styleUrl: './availability-editor.component.scss'
})
export class AvailabilityEditorComponent {

  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  constructor() {
    setTimeout(() => {
      this.ranges.update((old)=> {return {
        Thursday: [
          {
            start: {
              hour: 6,
              minutes: 0,
            },
            end: { hour: 8, minutes: 0 },
          },
          {
            start: {
              hour: 10,
              minutes: 0,
            },
            end: { hour: 20, minutes: 0 },
          },
        ],
        Saturday: [
          {
            start: {
              hour: 8,
              minutes: 0,
            },
            end: { hour: 10, minutes: 0 },
          },
          {
            start: {
              hour: 12,
              minutes: 0,
            },
            end: { hour: 15, minutes: 0 },
          },
          {
            start: {
              hour: 18,
              minutes: 0,
            },
            end: { hour: 22, minutes: 0 },
          },
        ],
      }});
    }, 10000);
  }

  ranges = signal<{ [key: string]: TimeSlot[] }>({
    Monday: [
      {
        start: {
          hour: 6,
          minutes: 0,
        },
        end: { hour: 8, minutes: 0 },
      },
      {
        start: {
          hour: 10,
          minutes: 0,
        },
        end: { hour: 20, minutes: 0 },
      },
    ],
    Tuesday: [
      {
        start: {
          hour: 8,
          minutes: 0,
        },
        end: { hour: 10, minutes: 0 },
      },
      {
        start: {
          hour: 12,
          minutes: 0,
        },
        end: { hour: 15, minutes: 0 },
      },
      {
        start: {
          hour: 18,
          minutes: 0,
        },
        end: { hour: 22, minutes: 0 },
      },
    ],
  });

}
