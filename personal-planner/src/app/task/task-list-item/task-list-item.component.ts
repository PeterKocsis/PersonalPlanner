import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ITask } from '../../interfaces/task.interface';
import { TaskService } from '../../../services/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SpacesService } from '../../../services/spaces.service';
import { ISpace } from '../../interfaces/space.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskEditorDialogComponent } from '../task-editor-dialog/task-editor-dialog.component';

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
  taskService = inject(TaskService);
  spaceServie = inject(SpacesService);
  dialog = inject(MatDialog);
  itemHovered = false;
  spaces = computed(() => [
    this.spaceServie.inboxSpace(),
    ...this.spaceServie.spaces(),
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
    this.dialog.open(TaskEditorDialogComponent, {
      data: this.task(),
      width: '400px',
    });
  }

  onComplete() {
    this.taskService.completeTask(this.task()._id);
  }
}
