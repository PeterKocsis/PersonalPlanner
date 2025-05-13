import {
  Component,
  computed,
  inject,
  model,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TaskService } from '../../../services/task.service';
import { SpacesService } from '../../../services/spaces.service';
import { ISpace } from '../../interfaces/space.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-task-editor-dialog',
  imports: [
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TextFieldModule
  ],
  templateUrl: './task-editor-dialog.component.html',
  styleUrl: './task-editor-dialog.component.scss',
})
export class TaskEditorDialogComponent {
  taskService = inject(TaskService);
  spaceService = inject(SpacesService);

  spaces = computed(() => [
    this.spaceService.inboxSpace(),
    ...this.spaceService.spaces(),
  ]);

  constructor() {
  }

  get selectedSpace() {
    return computed(()=>this.task().spaceId)();
  }

  set selectedSpace(value: string) {
    this.task.update((previous)=>{return {...previous, spaceId: value!}});
  }

  onCancel() {
    this.dialogRef.close();
  }

  async onAccept() {
    try {
      await this.taskService.updateTask(this.task());
      this.dialogRef.close();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  readonly dialogRef = inject(MatDialogRef<TaskEditorDialogComponent>);
  readonly data = inject<ITask>(MAT_DIALOG_DATA);
  readonly task = model({ ...this.data });
}
