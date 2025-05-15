import { computed, inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SpacesService } from '../adapters/spaces.service';
import { ITask } from '../app/interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditorDialogComponent } from '../app/task/task-editor-dialog/task-editor-dialog.component';
import { TaskAdapterService } from '../adapters/task.adapter.service';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
}
)
export class TaskEditorDialogService {
  spacesService = inject(SpacesService);
  taskAdapterService = inject(TaskAdapterService);
  currentSpaceId: string | undefined = undefined;
  dialog = inject(MatDialog);

  spaces = computed(() => [
    this.spacesService.inboxSpace(),
    ...this.spacesService.spaces(),
  ]);

  private _tempTask: ITask | undefined = undefined;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.getChild(this.activatedRoute);
        child.paramMap.subscribe(params => {
          const currentId = params.get('spaceId');
          console.log('Route param:', currentId);
          this.currentSpaceId = currentId ? currentId: this.spacesService.inboxSpace()?._id;
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
      this.dialog.open(TaskEditorDialogComponent, {
        data: { task: this._tempTask, spaceId: this._tempTask.spaceId },
        width: '500px',
      });
    }
  }

  editTask(task: ITask) {
    this._tempTask = undefined;
    this.dialog.open(TaskEditorDialogComponent, {
      data: { task: task, spaceId: task.spaceId },
      width: '500px',
    });
  }
}
