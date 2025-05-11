import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ITask } from '../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list-item',
  imports: [MatCheckboxModule, MatButtonModule, MatIconModule],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  itemHovered = false;

  onMouseEnter() {
    this.itemHovered = true;
  }
  onMouseLeave() {
    this.itemHovered = false;
  }
  onSetCompletionTime() {
    throw new Error('Method not implemented.');
  }
  onAssignToSpace() {
    throw new Error('Method not implemented.');
  }
  onAssignToWeek() {
    throw new Error('Method not implemented.');
  }
  task = input.required<ITask>();
  taskService = inject(TaskService);

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
