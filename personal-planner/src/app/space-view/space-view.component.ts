import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SpacesService } from '../../adapters/spaces.service';
import { TaskAdapterService } from '../../adapters/task.adapter.service';
import { ITask } from '../interfaces/task.interface';
import { TaskListItemComponent } from '../task/task-list-item/task-list-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditorDialogService } from '../../services/task-editor-dialog.service';

@Component({
  selector: 'app-space-view',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButtonModule,
    TaskListItemComponent,
    MatIconModule,
  ],
  templateUrl: './space-view.component.html',
  styleUrl: './space-view.component.scss',
})
export class SpaceViewComponent {
  taskService = inject(TaskAdapterService);
  spacesService = inject(SpacesService);
  taskEditorDialogService = inject(TaskEditorDialogService);
  spaceId = input.required<string>();
  dialog = inject(MatDialog);
  tasksToDo = computed<ITask[]>(() => {
    return this.taskService
    .tasks()
    .filter(
      (task: ITask) =>
        task.spaceId === this.spaceId() && task.completed === false
    );
  });
  
  tasksCompleted = computed<ITask[]>(() => {
    return this.taskService
    .tasks()
    .filter(
      (task: ITask) =>
        task.spaceId === this.spaceId() && task.completed === true
    );
  });
  
  newTaskTitle: string = '';

  onAddTask() {
    this.taskEditorDialogService.addTask(this.newTaskTitle);
    this.newTaskTitle = '';
  }

  onDrop(event: any) {}
}
