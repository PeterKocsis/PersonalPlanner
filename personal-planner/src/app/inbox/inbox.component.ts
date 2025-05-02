import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ITask } from '../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-inbox',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
})
export class InboxComponent implements OnInit {
  newTaskTitle: string = '';
  tasks: ITask[] = [];
  taskService = inject(TaskService);
  containerId: string | undefined = undefined;

  ngOnInit() {
    this.containerId = this.taskService.getContainerId();
  }
  onAddTask() {
    if (this.newTaskTitle) {
      const newTask: ITask = {
        _id: '',
        title: this.newTaskTitle,
        assignedContainerId: '',
      };
      this.tasks.push();
      this.newTaskTitle = '';
    }
  }

  onDrop(event: any) {}
}
