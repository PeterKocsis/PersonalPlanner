import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { SpacesService } from '../../adapters/spaces.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ISpace } from '../interfaces/space.interface';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { SpaceItemComponent } from './space-item/space-item.component';
import { AppStateService } from '../../services/app-state.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Time } from '@angular/common';
import {
  DailyTimeSlotEditorComponent,
  TimeSlot,
} from './daily-time-slot-editor/daily-time-slot-editor.component';

@Component({
  selector: 'app-space-manager',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
    SpaceItemComponent,
    MatTabsModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    DailyTimeSlotEditorComponent,
  ],
  templateUrl: './space-manager.component.html',
  styleUrl: './space-manager.component.scss',
})
export class SpaceManagerComponent {
  spaceService = inject(SpacesService);
  appStateService = inject(AppStateService);
  schedules = viewChildren<ElementRef<HTMLCanvasElement>>('canvas');

  spaces = this.appStateService.spaces;
  newSpaceName: string = '';

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

  drop(event: any) {
    const spaceCopy = [...this.spaces()];
    moveItemInArray(spaceCopy, event.previousIndex, event.currentIndex);
    this.spaceService.updateSpacePriorityList(spaceCopy);
  }

  addSpace() {
    if (this.newSpaceName) {
      this.spaceService.addSpace(this.newSpaceName);
    }
  }
}
