import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpacesService } from '../../adapters/spaces.service';
import { TaskAdapterService } from '../../adapters/task.adapter.service';
import { ITask } from '../interfaces/task.interface';
import { TaskListItemComponent } from '../task/task-list-item/task-list-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditorDialogService } from '../../services/task-editor-dialog.service';
import { TimeFrameViewerComponent } from '../time-frame-viewer/time-frame-viewer.component';
import { TimeFrameAdapterService } from '../../adapters/time-frame.adapter.service';
import { CommonModule } from '@angular/common';
import { RangeSelectorComponent } from '../range-selector/range-selector.component';
import { ITimeRange } from '../interfaces/time-range.interface';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-space-view',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    TaskListItemComponent,
    CommonModule,
    RangeSelectorComponent,
    MatIconModule,
    TimeFrameViewerComponent,
  ],
  templateUrl: './space-view.component.html',
  styleUrl: './space-view.component.scss',
})
export class SpaceViewComponent {
  taskService = inject(TaskAdapterService);
  appStateService = inject(AppStateService);
  spacesService = inject(SpacesService);
  taskEditorDialogService = inject(TaskEditorDialogService);
  spaceId = input.required<string>();
  timeFrameService = inject(TimeFrameAdapterService);
  selectedTimeFrame = computed(() => {
    if (this.selectedTimeRange() === undefined) {
      return this.appStateService.timeFrames()[0] || undefined;
    }
    return this.appStateService
      .timeFrames()
      .find(
        (frame) =>
          frame.year === this.selectedTimeRange()?.year &&
          frame.index === this.selectedTimeRange()?.index
      );
  });
  dialog = inject(MatDialog);
  today = new Date();
  tasksToDo = computed<ITask[]>(() => {
    return this.appStateService
      .tasks()
      .filter(
        (task: ITask) =>
          task.spaceId === this.spaceId() &&
          task.completed === false &&
          !task.assignedTimeRange
      );
  });

  tasksCompleted = computed<ITask[]>(() => {
    return this.appStateService
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
  private selectedTimeRange = signal<ITimeRange | undefined>(undefined);

  async onSelectedRangeChanged(ranges: ITimeRange[]) {
    this.selectedTimeRange.set(ranges[0]);
    this.timeFrameService.getFramesByRanges(ranges)
  }

  async onAssignTaskToTimeFrame(taskId: string) {
    const selectedFrame = this.selectedTimeFrame();
    if (selectedFrame) {
      const targetTask = this.appStateService
        .tasks()
        .find((task) => task._id === taskId);
      targetTask!.assignedTimeRange = this.selectedTimeRange();
      this.taskService.updateTask(targetTask!);
    }
  }
}
