import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './task-editor-dialog.component.html',
  styleUrl: './task-editor-dialog.component.scss',
})
export class TaskEditorDialogComponent {

  taskeditorDialogService = inject(TaskEditorDialogService);
  timeFrameService = inject(TimeFrameAdapterService);

  selectedTimeFrame = signal<ITimeFrame | undefined>(undefined);
  
  constructor() {
    effect(() => {
      if (this.selectedTimeFrame() === undefined) {
        this.selectedTimeFrame.set(
          this.timeFrameService.timeFrames()[0] || undefined
        );
      }
    });
  }
  
  get selectedSpace() {
    return computed(() => this.task().spaceId)();
  }
  
  async onSelectionChanged($event: ITimeRange[]) {
    const startDate = $event[0].startDate;
    const endDate = $event[$event.length - 1].startDate;
    const resultFrame = (
      await this.timeFrameService.getTimeFrames(startDate, endDate)
    )[0];
    this.selectedTimeFrame.set(resultFrame);
  }

  set selectedSpace(value: string | undefined) {
    this.task.update((previous) => {
      return { ...previous, spaceId: value! };
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  get timeToFinish(): string | undefined {
    return computed(() => this.task().timeToCompleteMinutes)()?.toString();
  }

  set timeToFinish(value: string | undefined) {
    const timeToFinish = value ? parseInt(value) : undefined;
    this.task.update((previous) => {
      return { ...previous, timeToCompleteMinutes: timeToFinish };
    });
  }

  async onAccept() {
    try {
      this.taskeditorDialogService.saveTask(this.task());
      this.dialogRef.close();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  readonly dialogRef = inject(MatDialogRef<TaskEditorDialogComponent>);
  readonly data = inject<{ task: ITask; spaceId: string | undefined }>(
    MAT_DIALOG_DATA
  );
  readonly task = model(this.data.task);
}
