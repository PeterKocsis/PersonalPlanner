import {
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
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
  ],
  templateUrl: './task-editor-dialog.component.html',
  styleUrl: './task-editor-dialog.component.scss',
})
export class TaskEditorDialogComponent {
  taskeditorDialogService = inject(TaskEditorDialogService);

  constructor() {
  }

  get selectedSpace() {
    return computed(() => this.task().spaceId)();
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
  readonly data = inject<{task: ITask, spaceId: string | undefined}>(MAT_DIALOG_DATA);
  readonly task = model(this.data.task);
}
