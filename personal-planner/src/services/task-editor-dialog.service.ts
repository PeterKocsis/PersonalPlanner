import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ITask } from '../app/interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditorDialogComponent } from '../app/task/task-editor-dialog/task-editor-dialog.component';
import { TaskAdapterService } from '../adapters/task.adapter.service';
import { filter } from 'rxjs';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class TaskEditorDialogService {
  taskAdapterService = inject(TaskAdapterService);  
  appStateService = inject(AppStateService);

  currentSpaceId: string | undefined = undefined;
  dialog = inject(MatDialog);

  spaces = computed(() => [
    this.appStateService.inboxSpace(),
    ...this.appStateService.spaces(),
  ]);

  private _tempTask: ITask | undefined = undefined;

  //TODO This solution is not ideal. It does not handle cases when the browser reloads the page which has spaceId in the URL.
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.getChild(this.activatedRoute);
        child.paramMap.subscribe((params) => {
          const currentId = params.get('spaceId');
          console.log('Route param:', currentId);
          this.currentSpaceId = currentId
            ? currentId
            : this.appStateService.inboxSpace()?._id;
          console.log('Route param in service:', this.currentSpaceId);
        });
      });
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private createTask(): ITask {
    return {
      _id: '',
      title: '',
      description: '',
      completed: false,
      spaceId: this.currentSpaceId!,
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
