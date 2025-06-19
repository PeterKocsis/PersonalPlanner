import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TaskEditorDialogService } from '../../../services/task-editor-dialog.service';
import { TimeFrameViewerComponent } from '../../time-frame-viewer/time-frame-viewer.component';
import { RangeSelectorComponent } from '../../range-selector/range-selector.component';
import { ITimeRange } from '../../interfaces/time-range.interface';
import { TimeFrameAdapterService } from '../../../adapters/time-frame.adapter.service';
import { ITimeFrame } from '../../interfaces/time-frame.interface';
import { last } from 'rxjs';

@Component({
  selector: 'app-task-editor-dialog',
  imports: [
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TextFieldModule,
    MatButtonToggleModule,
    TimeFrameViewerComponent,
    RangeSelectorComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './task-editor-dialog.component.html',
  styleUrl: './task-editor-dialog.component.scss',
})
export class TaskEditorDialogComponent {
  taskeditorDialogService = inject(TaskEditorDialogService);
  timeFrameService = inject(TimeFrameAdapterService);
  readonly dialogRef = inject(MatDialogRef<TaskEditorDialogComponent>);
  readonly data = inject<{ task: ITask; spaceId: string | undefined }>(
    MAT_DIALOG_DATA
  );

  selectedTimeFrame = signal<ITimeFrame | undefined>(undefined);

  form = new FormGroup({
    title: new FormControl<string | undefined>(this.data.task.title, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl<string | undefined>(
      this.data.task.description,
      {
        nonNullable: true,
      }
    ),
    timeToFinish: new FormControl<string | undefined>(
      this.data.task.timeToCompleteMinutes?.toString(),
      {
        nonNullable: true,
      }
    ),
    spaceId: new FormControl<string | undefined>(this.data.task.spaceId, {
      nonNullable: true,
    }),
    assignedTimeRange: new FormControl<ITimeRange | undefined>(
      this.data.task.assignedTimeRange,
      { nonNullable: true }
    ),
  });

  get displayedAssignedTimeRange(): string {
    return this.form.controls.assignedTimeRange.value
      ? `${this.form.controls.assignedTimeRange.value?.year}.${this.form.controls.assignedTimeRange.value?.index}`
      : '';
  }

  constructor() {
    effect(() => {
      if (this.selectedTimeFrame() === undefined) {
        this.selectedTimeFrame.set(
          this.timeFrameService.timeFrames()[0] || undefined
        );
      }
    });
  }

  onOpenFrameBrowser() {
    this.showTimaRangeSelector.set(true);
    this.dialogRef.updateSize('1200px');
  }

  onUnassignTimeRange() {
    this.form.get('assignedTimeRange')?.setValue(undefined);
    this.showTimaRangeSelector.set(false);
    this.dialogRef.updateSize('600px');
  }

  get assignedTimeRange() {
    return this.form.get('assignedTimeRange')?.value;
  }

  showTimaRangeSelector = signal<boolean>(false);

  async onSelectionChanged(ranges: ITimeRange[]) {
    this.form.get('assignedTimeRange')?.setValue(ranges?.[0]);
    const startDate = ranges[0].startDate;
    const endDate = ranges[ranges.length - 1].startDate;
    const resultFrame = (
      await this.timeFrameService.getTimeFrames(startDate, endDate)
    )[0];
    this.selectedTimeFrame.set(resultFrame);
  }

  onCancel() {
    this.dialogRef.close();
  }

  async onAccept() {
    if (this.form.invalid) {
      return;
    }
    try {
      const editedTask: ITask = {
        _id: this.data.task._id,
        title: this.form.controls.title.value!,
        description: this.form.controls.description.value,
        timeToCompleteMinutes: this.form.controls.timeToFinish.value
          ? parseInt(this.form.controls.timeToFinish.value!, 10)
          : undefined,
        spaceId: this.form.controls.spaceId.value,
        assignedTimeRange: this.form.controls.assignedTimeRange.value,
        createdAt: this.data.task.createdAt,
        completed: this.data.task.completed,
      };

      this.taskeditorDialogService.saveTask(editedTask);
      this.dialogRef.close();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }
}
