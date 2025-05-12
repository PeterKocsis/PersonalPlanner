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

@Component({
  selector: 'app-task-list-item',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  task = input.required<ITask>();
  taskService = inject(TaskService);
  spaceServie = inject(SpacesService);
  itemHovered = false;
  spaces = computed(() => [
    this.spaceServie.inboxSpace(),
    ...this.spaceServie.spaces(),
  ]);
  private _selectedSpace: Signal<ISpace | undefined>;

  get selectedSpace() {
    return this._selectedSpace()?._id;
  }

  set selectedSpace(value: string | undefined) {
    this.onAssignToSpace(value!);
  }

  constructor() {
    this._selectedSpace = computed(() =>
      this.spaces().find((item) => item?._id === this.task().spaceId)
    );
  }

  onMouseEnter() {
    this.itemHovered = true;
  }
  onMouseLeave() {
    this.itemHovered = false;
  }
  onSetCompletionTime() {
    throw new Error('Method not implemented.');
  }
  onAssignToSpace(spaceId: string) {
    this.taskService.assignToSpace(this.task()._id, spaceId);
  }
  onAssignToWeek() {
    throw new Error('Method not implemented.');
  }

  onDelete() {
    this.taskService.deleteTask(this.task()._id);
  }

  onEdit() {
    console.log(`Start edit on: ${this.task().title}`);
  }

  onComplete() {
    this.taskService.completeTask(this.task()._id);
  }
}
