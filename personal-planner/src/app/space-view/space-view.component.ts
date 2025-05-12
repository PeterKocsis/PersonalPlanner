import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  inject,
  Input,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SpacesService } from '../../services/spaces.service';
import { TaskService } from '../../services/task.service';
import { ITask } from '../interfaces/task.interface';
import { TaskListItemComponent } from '../task/task-list-item/task-list-item.component';

@Component({
  selector: 'app-space-view',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
    TaskListItemComponent,
  ],
  templateUrl: './space-view.component.html',
  styleUrl: './space-view.component.scss',
})
export class SpaceViewComponent {
  taskService = inject(TaskService);
  spacesService = inject(SpacesService);
  spaceId = input.required<string>();
  tasks = computed<ITask[]>(() => {
    return this.taskService
      .tasks()
      .filter((task: ITask) => task.spaceId === this.spaceId());
  });

  newTaskTitle: string = '';

  onAddTask() {
    if (this.newTaskTitle) {
      const newTask: ITask = {
        _id: '',
        title: this.newTaskTitle,
        spaceId: this.spaceId()!,
      };
      this.taskService.addTask(newTask);
      this.newTaskTitle = '';
    }
  }

  onDrop(event: any) {}
}
