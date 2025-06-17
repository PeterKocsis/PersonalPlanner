import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
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
import { TimeFrameViewerComponent } from '../time-frame-viewer/time-frame-viewer.component';
import { ITimeFrame } from '../interfaces/time-frame.interface';
import { TimeFrameAdapterService } from '../../adapters/time-frame.adapter.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RangeSelectorComponent } from '../range-selector/range-selector.component';
import { ITimeRange } from '../interfaces/time-range.interface';

@Component({
  selector: 'app-space-view',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButtonModule,
    TaskListItemComponent,
    CommonModule,
    AsyncPipe,
    RangeSelectorComponent,
    MatIconModule,
    TimeFrameViewerComponent,
  ],
  templateUrl: './space-view.component.html',
  styleUrl: './space-view.component.scss',
})
export class SpaceViewComponent {
  taskService = inject(TaskAdapterService);
  spacesService = inject(SpacesService);
  taskEditorDialogService = inject(TaskEditorDialogService);
  spaceId = input.required<string>();
  timeFrameService = inject(TimeFrameAdapterService);
  selectedTimeFrame = signal<ITimeFrame | undefined>(undefined);
  dialog = inject(MatDialog);
  today = new Date();
  tasksToDo = computed<ITask[]>(() => {
    return this.taskService
      .tasks()
      .filter(
        (task: ITask) =>
          task.spaceId === this.spaceId() &&
          task.completed === false &&
          !task.taskPocketRangeId
      );
  });

  constructor() {
    effect(() => {
      if (this.selectedTimeFrame() === undefined) {
        this.selectedTimeFrame.set(
          this.timeFrameService.timeFrames()[0] || undefined
        );
      }
    });
  }

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

  async onSelectedRangeChanged($event: ITimeRange[]) {
    const startDate = $event[0].startDate;
    const endDate = $event[$event.length - 1].startDate;
    const resultFrame = (
      await this.timeFrameService.getTimeFrames(startDate, endDate)
    )[0];
    this.selectedTimeFrame.set(resultFrame);
  }

  async onAssignTaskToTimeFrame(taskId: string) {
    const selectedFrame = this.selectedTimeFrame();
    if (selectedFrame) {
      await this.timeFrameService.addTaskToTimeFrame(
        taskId,
        selectedFrame.year,
        selectedFrame.index
      );
      const updatedFrame = this.timeFrameService.timeFrames().find(
        (frame) =>
          frame.year === selectedFrame.year && frame.index === selectedFrame.index)
      this.selectedTimeFrame.set(updatedFrame);
    }
  }
}
