import { computed, inject, Injectable } from '@angular/core';
import { ITask } from '../app/interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditorDialogComponent } from '../app/task/task-editor-dialog/task-editor-dialog.component';
import { TaskAdapterService } from '../adapters/task.adapter.service';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class TaskEditorDialogService {
  taskAdapterService = inject(TaskAdapterService);  
  appStateService = inject(AppStateService);

  dialog = inject(MatDialog);

  spaces = computed(() => [
    this.appStateService.inboxSpace(),
    ...this.appStateService.spaces(),
  ]);

  private _tempTask: ITask | undefined = undefined;

  private createTask(): ITask {
    return {
      _id: '',
      title: '',
      description: '',
      completed: false,
      spaceId: this.appStateService.targetSpaceId()!,
      createdAt: new Date(),
      timeToCompleteMinutes: undefined,
    };
  }

  saveTask(task: ITask) {
    if (this._tempTask) {
      this.taskAdapterService.addTask(task);
    } else {
      this.taskAdapterService.updateTask(task);
    }
  }

  addTask(title?: string) {
    this._tempTask = this.createTask();
    if (title) {
      this._tempTask.title = title;
      this.saveTask(this._tempTask);
    } else {
      const dialogRef = this.dialog.open(TaskEditorDialogComponent, {
        data: { task: this._tempTask, spaceId: this._tempTask.spaceId },
        width: '600px',
      });
      dialogRef.beforeClosed().subscribe((result) => {
        if (result) {
          this.saveTask(this._tempTask!);
        } else {
          this._tempTask = undefined; // Reset temp task if dialog is closed without saving
        }
      });
    }
  }

  editTask(task: ITask) {
    this._tempTask = undefined;
    this.dialog.open(TaskEditorDialogComponent, {
      data: { task: task, spaceId: task.spaceId },
      width: '600px',
    });
  }
}
