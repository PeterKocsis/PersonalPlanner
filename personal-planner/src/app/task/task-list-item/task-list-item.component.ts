import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ITask } from '../../interfaces/task.interface';
import { TaskAdapterService } from '../../../adapters/task.adapter.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskEditorDialogService } from '../../../services/task-editor-dialog.service';
import { TimeFrameAdapterService } from '../../../adapters/time-frame.adapter.service';
import { AppStateService } from '../../../services/app-state.service';

@Component({
  selector: 'app-task-list-item',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  task = input.required<ITask>();
  assingTaskTotimeFrame = output<string>();

  taskService = inject(TaskAdapterService);
  appStateService = inject(AppStateService);
  taskEditorDialogService = inject(TaskEditorDialogService);
  timeFrameAdapterService = inject(TimeFrameAdapterService);
  dialog = inject(MatDialog);

  itemHovered = false;
  spaces = computed(() => [
    this.appStateService.inboxSpace(),
    ...this.appStateService.spaces(),
  ]);

  onMouseEnter() {
    this.itemHovered = true;
  }
  onMouseLeave() {
    this.itemHovered = false;
  }
  onSetCompletionTime() {
    throw new Error('Method not implemented.');
  }
  onAssignToWeek() {
    throw new Error('Method not implemented.');
  }

  onDelete() {
    this.taskService.deleteTask(this.task()._id);
  }

  onEdit() {
    this.taskEditorDialogService.editTask(this.task());
  }

  onToggleComplete() {
    // this.taskService.setTaskState(this.task()._id, !this.task().completed);
    this.taskService.updateTask({...this.task(), completed: !this.task().completed });
  }

  onAssignTimeFrame() {
    this.assingTaskTotimeFrame.emit(this.task()._id);
  }
}
