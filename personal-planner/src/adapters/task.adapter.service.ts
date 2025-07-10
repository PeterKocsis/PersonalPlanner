import { inject, Injectable } from '@angular/core';
import { ITask } from '../app/interfaces/task.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Subject } from 'rxjs';
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
  modifiedFrames?: ITimeFrame[];
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
      .put<{message: string, task: ITask, modifiedFrames?: ITimeFrame[]}>(`http://localhost:3000/api/tasks/${task._id}`, task)
      .pipe(
        map((response) => {
          if (!response.modifiedFrames) {
            return { ...response, modifiedFrames: [] };
          }
          return {
            ...response,
            modifiedFrames: response.modifiedFrames.map((frame) => ({
              ...frame,
              startDate: new Date(frame.startDate),
              endDate: new Date(frame.endDate),
            })),
          };
        })
      )
      .subscribe({
        next: (data) => {
          this.tasks$.next(
            this.tasks$.value.map((t) => (t._id === task._id ? task : t))
          );
          console.log('Task updated successfully:', data);
          this.taskEvents$.next({
            type: 'taskUpdated',
            task: task,
            modifiedFrames: data.modifiedFrames,
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

  // assignToSpace(taskId: string, spaceId: string) {
  //   this.http
  //     .put<ITask>(`http://localhost:3000/api/tasks/${taskId}/space`, {
  //       spaceId: spaceId,
  //     })
  //     .subscribe({
  //       next: (result) => {
  //         this.tasks$.next(
  //           this.tasks$.value.map((task) => {
  //             let mappedTask = { ...task };
  //             if (mappedTask._id === taskId) {
  //               mappedTask = { ...mappedTask, spaceId: spaceId };
  //             }
  //             return mappedTask;
  //           })
  //         );
  //         console.log(
  //           `Task (${taskId}) successfully assigned to space (${spaceId})`
  //         );
  //         this.taskEvents$.next({
  //           type: 'taskAssignedToSpace',
  //           task: result,
  //         });
  //       },
  //       error: (error) => {
  //         console.error(
  //           `Failed to assign spaceId (${spaceId}) to task (${taskId})`,
  //           error
  //         );
  //       },
  //     });
  // }

  addTask(task: ITask): void {
    this.http
      .post<{ message: string; task: ITask; modifiedFrame?: ITimeFrame }>(
        `http://localhost:3000/api/tasks`,
        task
      )
      .pipe(
        map((response) => {
          if (!response.modifiedFrame) {
            return { ...response, modifiedFrame: undefined };
          }
          return {
            ...response,
            modifiedFrame: {
              ...response.modifiedFrame,
              startDate: new Date(response.modifiedFrame.startDate),
              endDate: new Date(response.modifiedFrame.endDate),
            }
          };
        })
      )
      .subscribe({
        next: (data) => {
          this.tasks$.next([...this.tasks$.getValue(), data.task]);
          console.log('Task added successfully:', data.task);
          console.log('Modified frame:', data.modifiedFrame);
          this.taskEvents$.next({
            type: 'taskAdded',
            task: task,
            modifiedFrames: data.modifiedFrame ? [data.modifiedFrame] : [],
          });
        },
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
  }

  deleteTask(_id: string): void {
    console.log(`Request to delete task with id: ${_id}`);
    this.http.delete<{message: string, modifiedFrame?: ITimeFrame}>(`http://localhost:3000/api/tasks/${_id}`)
    .pipe(
      map((response) => {
        if (response.modifiedFrame) {
          return {
            ...response,
            modifiedFrame: {
              ...response.modifiedFrame,
              startDate: new Date(response.modifiedFrame.startDate),
              endDate: new Date(response.modifiedFrame.endDate),
            }
          };
        }
        return response;
      })
    )
    .subscribe({
      next: (data) => {
        console.log(`Task successfuly deleted with id: ${_id}`);
        const deleteTask = this.tasks$.value.find((task) => task._id === _id);
        this.tasks$.next(this.tasks$.value.filter((task) => task._id !== _id));
        this.taskEvents$.next({
          type: 'taskDeleted',
          task: deleteTask!,
          modifiedFrames: data.modifiedFrame ? [data.modifiedFrame] : [],
        });
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      },
    });
  }

  // setTaskState(_id: string, newState: boolean): void {
  //   this.http
  //     .put<ITask>(`http://localhost:3000/api/tasks/${_id}/state`, {
  //       state: newState,
  //     })
  //     .subscribe({
  //       next: (responseTask) => {
  //         this.tasks$.next(
  //           this.tasks$.value.map((task) =>
  //             task._id === _id ? responseTask : task
  //           )
  //         );
  //         console.log(
  //           `Task state updated successfully for task with id: ${_id}`
  //         );
  //         this.taskEvents$.next({
  //           type: 'taskStateChanged',
  //           task: responseTask,
  //         });
  //       },
  //       error: (error) => {
  //         console.error('Error updating task state:', error);
  //       },
  //     });
  // }
}
