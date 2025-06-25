import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type TimeSlot = {
  start: {
    hour: number;
    minutes: number;
  };
  end: {
    hour: number;
    minutes: number;
  };
};

@Component({
  selector: 'app-daily-time-slot-editor',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './daily-time-slot-editor.component.html',
  styleUrl: './daily-time-slot-editor.component.scss',
})
export class DailyTimeSlotEditorComponent implements AfterViewInit {
  dayName = input.required<string>();
  showTimeScale = input<boolean>(false);
  timeSlots = input.required<TimeSlot[] | undefined>();
  timeScale = Array.from({ length: 24 }, (_, i) => {
    return i;
  });

  scheduleCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('schedule');
  scheduleCanvasContext: CanvasRenderingContext2D | null | undefined = null;

  canvasWidth = 0;
  canvasHeight = 0;

  constructor() {
    effect(() => {
      this.drawDataOnCanvas(
        this.canvasWidth,
        this.canvasHeight,
        this.timeSlots()
      );
    });
  }

  ngAfterViewInit(): void {
    if (this.scheduleCanvas().nativeElement.getContext) {
      this.scheduleCanvasContext =
        this.scheduleCanvas().nativeElement.getContext('2d');
      this.canvasWidth = Math.floor(this.scheduleCanvas().nativeElement.width);
      this.canvasHeight = Math.floor(this.scheduleCanvas().nativeElement.height);
    }
    this.drawDataOnCanvas(
      this.canvasWidth,
      this.canvasHeight,
      this.timeSlots()
    );
  }

  private drawDataOnCanvas(
    width: number,
    height: number,
    timeSlots: TimeSlot[] | undefined
  ): void {
    console.log('Drawing on canvas');
    if (!this.canDraw() && !this.scheduleCanvasContext) return;
    this.scheduleCanvasContext!.clearRect(0, 0, width, height);
    this.drawUnavailablePattern(width, height);
    this.drawTimeScaleDeviders(width, height);
    this.drawTimeSlotText(width, height);
    timeSlots?.forEach((timeSlot) => {
      this.drawAvailableTimeSlots(width, height, timeSlot);
    });
  }

  private drawTimeScaleDeviders(width: number, height: number): void {
    if (!this.scheduleCanvasContext) return;
    this.scheduleCanvasContext.strokeStyle = '#ccc';
    this.scheduleCanvasContext.lineWidth = 1;
    for (let i = 2; i <= 24; i += 2) {
      const y = Math.floor((height / 24) * i);
      this.scheduleCanvasContext.beginPath();
      this.scheduleCanvasContext.moveTo(0, y);
      this.scheduleCanvasContext.lineTo(width, y);
      this.scheduleCanvasContext.stroke();
    }
  }

  private drawUnavailablePattern(width: number, height: number): void {
    if (!this.scheduleCanvasContext) return;
    this.scheduleCanvasContext.fillStyle = 'rgba(0, 150, 136, 0.1)';
    this.scheduleCanvasContext.fillRect(0, 0, width, height);
  }

  private canDraw(): boolean {
    if (!this.scheduleCanvasContext) return false;
    return this.canvasWidth > 0 && this.canvasHeight > 0;
  }

  private drawTimeSlotText(width: number, height: number): void {
    if (!this.scheduleCanvasContext) return;
    this.scheduleCanvasContext.font = '16px Arial';
    this.scheduleCanvasContext.fillStyle = 'black';
    for (let i = 0; i < this.timeScale.length; i += 2) {
      const hour = this.timeScale[i];
      const nextHour = hour + 2;
      const y = Math.floor((height / 24) * i);
      this.scheduleCanvasContext.fillText(
        `${hour}-${nextHour}h`,
        5,
        y + height / 24 + 8
      ); // Adjust the position as needed
    }
  }

  private drawAvailableTimeSlots(
    width: number,
    height: number,
    slot: TimeSlot
  ): void {
    if (!this.scheduleCanvasContext) return;
    console.log('Drawing time slot:', slot);
    const startMinutes = slot.start.hour * 60 + slot.start.minutes;
    const endMinutes = slot.end.hour * 60 + slot.end.minutes;
    const totalMinutes = 24 * 60;

    const startY = Math.floor((startMinutes / totalMinutes) * height);
    const endY = Math.floor((endMinutes / totalMinutes) * height);

    this.scheduleCanvasContext.fillStyle = 'rgba(0, 150, 136, 0.5)';
    this.scheduleCanvasContext.fillRect(0, startY, width, endY - startY);
  }
}
