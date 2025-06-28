import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimeSlot } from '../daily-time-slot-editor/daily-time-slot-editor.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-add-time-slot',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTimepickerModule,
  ],
  templateUrl: './add-time-slot.component.html',
  styleUrl: './add-time-slot.component.scss',
})
export class AddTimeSlotComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddTimeSlotComponent>);
  readonly data = inject<{ timeSlots: TimeSlot[] | undefined }>(
    MAT_DIALOG_DATA
  );

  form = new FormGroup({
    timeSlots: new FormArray<
      FormGroup<{ start: FormControl<Date>; end: FormControl<Date> }>
    >([]),
  });

  get timeSlots(): FormArray<
    FormGroup<{ start: FormControl<Date>; end: FormControl<Date> }>
  > {
    return this.form.controls.timeSlots as FormArray<
      FormGroup<{ start: FormControl<Date>; end: FormControl<Date> }>
    >;
  }

  ngOnInit(): void {
    this.data.timeSlots?.forEach((timeSlot) => {
      const startTime = new Date();
      startTime.setHours(timeSlot.start.hour, timeSlot.start.minutes, 0, 0);
      const endTime = new Date();
      endTime.setHours(timeSlot.end.hour, timeSlot.end.minutes, 0, 0);
      this.form.controls.timeSlots.push(
        new FormGroup({
          start: new FormControl<Date>(startTime, { nonNullable: true }),
          end: new FormControl<Date>(endTime, { nonNullable: true }),
        })
      );
    });
  }

  getTimeSlotStartMin(index: number): string {
    if (index === 0) {
      return '0:00';
    }

    return `${this.timeSlots.controls[
      index - 1
    ].value.end?.getHours()}:${this.timeSlots.controls[
      index - 1
    ].value.end?.getMinutes()}`;
  }

  getTimeSlotStartMax(index: number): string {
    if (index === this.timeSlots.length - 1) {
      return '24:00';
    }
    return `${this.timeSlots.controls[index + 1].value.start?.getHours()}:${
      this.timeSlots.controls[index + 1].value.start?.getMinutes()
    }`;
  }

  getTimeSlotEndMin(index: number): string {
    return `${this.timeSlots.controls[index].value.start?.getHours()}:${
      this.timeSlots.controls[index].value.start?.getMinutes()
    }`;
  }

  getTimeSlotEndMax(index: number): string {
    if (index === this.timeSlots.length - 1) {
      return '24:00';
    }
    return `${this.timeSlots.controls[index + 1].value.start?.getHours()}:${
      this.timeSlots.controls[index + 1].value.start?.getMinutes()
    }`;
  }

  onAddTimeSlot() {
    const startTime = new Date();
    const endTime = new Date();
    startTime.setHours(0, 0, 0, 0);
    endTime.setHours(23, 30, 0, 0);
    if(this.timeSlots.length > 0) {
      startTime.setHours(
        this.timeSlots.controls[this.timeSlots.length - 1].value.end!.getHours(),
        this.timeSlots.controls[this.timeSlots.length - 1].value.end!.getMinutes()
      );
      endTime.setHours(23, 30, 0, 0);
    }
    this.timeSlots.push(
      new FormGroup({
        start: new FormControl<Date>(startTime, { nonNullable: true }),
        end: new FormControl<Date>(endTime, { nonNullable: true }),
      })
    );
  }

  onRemoveTimeSlot(index: number) {
    this.form.controls.timeSlots.removeAt(index);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.valid) {
      const timeSlots: TimeSlot[] = this.timeSlots.controls.map((slot) => ({
        start: {
          hour: slot.value.start!.getHours(),
          minutes: slot.value.start!.getMinutes(),
        },
        end: {
          hour: slot.value.end!.getHours(),
          minutes: slot.value.end!.getMinutes(),
        },
      }));
      this.dialogRef.close(timeSlots);
    } else {
      // Handle form validation errors
      console.error('Form is invalid');
    }
  }
}
