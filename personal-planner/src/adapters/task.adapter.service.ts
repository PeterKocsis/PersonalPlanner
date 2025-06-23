import { inject, Injectable } from '@angular/core';
import { ITask } from '../app/interfaces/task.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { ITimeFrame } from '../app/interfaces/time-frame.interface';

export type TaskEvent =
  | 'taskAdded'
  | 'taskUpdated'
  | 'taskDeleted'
  | 'taskStateChanged'
  | 'taskAssignedToSpace';
export interface ITaskEvent {
  type: TaskEvent;
  task: ITask;
}

@Injectable({
  providedIn: 'root',
})
export class TaskAdapterService {
  private http = inject(HttpClient);
  tasks$ = new BehaviorSubject<ITask[]>([]);
  taskEvents$ = new Subject<ITaskEvent>();

  updateTask(task: ITask): void {
    this.http
      .put<ITask>(`http://localhost:3000/api/tasks/${task._id}`, task)
      .subscribe({
        next: (data) => {
          this.tasks$.next(
            this.tasks$.value.map((t) => (t._id === task._id ? task : t))
          );
          console.log('Task updated successfully:', data);
          this.taskEvents$.next({
            type: 'taskUpdated',
            task: task,
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getAllTask(): void {
    this.http
      .get<{ tasks: ITask[] }>(`http://localhost:3000/api/tasks`)
      .subscribe({
        next: (data) => {
          console.log('Fetched tasks:', data.tasks);
          this.tasks$.next(data.tasks);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  assignToSpace(taskId: string, spaceId: string) {
    this.http
      .put<ITask>(`http://localhost:3000/api/tasks/${taskId}/space`, {
        spaceId: spaceId,
      })
      .subscribe({
        next: (result) => {
          this.tasks$.next(
            this.tasks$.value.map((task) => {
              let mappedTask = { ...task };
              if (mappedTask._id === taskId) {
                mappedTask = { ...mappedTask, spaceId: spaceId };
              }
              return mappedTask;
            })
          );
          console.log(
            `Task (${taskId}) successfully assigned to space (${spaceId})`
          );
          this.taskEvents$.next({
            type: 'taskAssignedToSpace',
            task: result,
          });
        },
        error: (error) => {
          console.error(
            `Failed to assign spaceId (${spaceId}) to task (${taskId})`,
            error
          );
        },
      });
  }

  addTask(task: ITask): void {
    this.http
      .post<{ message: string; task: ITask; modifiedFrame: ITimeFrame }>(
        `http://localhost:3000/api/tasks`,
        task
      )
      .subscribe({
        next: (data) => {
          this.tasks$.next([...this.tasks$.getValue(), data.task]);
          console.log('Task added successfully:', data.task);
          this.taskEvents$.next({
            type: 'taskAdded',
            task: task,
          });
        },
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
  }

  deleteTask(_id: string): void {
    console.log(`Request to delete task with id: ${_id}`);
    this.http.delete(`http://localhost:3000/api/tasks/${_id}`).subscribe({
      next: () => {
        console.log(`Task successfuly deleted with id: ${_id}`);
        const deleteTask = this.tasks$.value.find((task) => task._id === _id);
        this.tasks$.next(this.tasks$.value.filter((task) => task._id !== _id));
        this.taskEvents$.next({
          type: 'taskDeleted',
          task: deleteTask!,
        });
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      },
    });
  }

  setTaskState(_id: string, newState: boolean): void {
    this.http
      .put<ITask>(`http://localhost:3000/api/tasks/${_id}/state`, {
        state: newState,
      })
      .subscribe({
        next: (responseTask) => {
          this.tasks$.next(
            this.tasks$.value.map((task) =>
              task._id === _id ? responseTask : task
            )
          );
          console.log(
            `Task state updated successfully for task with id: ${_id}`
          );
          this.taskEvents$.next({
            type: 'taskStateChanged',
            task: responseTask,
          });
        },
        error: (error) => {
          console.error('Error updating task state:', error);
        },
      });
  }
}
