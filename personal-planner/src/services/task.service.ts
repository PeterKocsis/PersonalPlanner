import { effect, inject, Injectable, signal } from '@angular/core';
import { ITask } from '../app/interfaces/task.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  tasks$ = new BehaviorSubject<ITask[]>([]);
  tasks = toSignal(this.tasks$, { initialValue: [] });

  updateTask(task: ITask): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .put<ITask>(
          `http://localhost:3000/api/tasks/${task._id}`,
          task
        )
        .subscribe({
          next: (data) => {
            this.tasks$.next(
              this.tasks$.value.map((t) => (t._id === task._id ? task : t))
            );
            resolve();
          },
          error: (error) => {
            console.error('Error updating task:', error);
            reject(error);
          },
        });
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
          console.error('Error fetching tasks:', error);
        },
      });
  }

  assignToSpace(taskId: string, spaceId: string) {
    this.http
      .put<ITask>(
        `http://localhost:3000/api/tasks/${taskId}/space`,
        { spaceId: spaceId },
      )
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
        },
        error: (error) => {
          console.error(
            `Failed to assign spaceId (${spaceId}) to task (${taskId})`,
            error
          );
        },
      });
  }

  addTask(task: ITask): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<{ message: string; task: ITask }>(
          `http://localhost:3000/api/tasks`,
          task
        )
        .subscribe({
          next: (data) => {
            this.tasks$.next([...this.tasks$.getValue(), data.task]);
            resolve();
          },
          error: (error) => {
            console.error('Error creating task:', error);
            reject(error);
          },
          complete: () => {
            reject('There was no response on add task request');
          },
        });
    });
  }

  deleteTask(_id: string): Promise<void> {
    console.log(`Request to delete task with id: ${_id}`);
    return new Promise<void>((resolve, reject) => {
      this.http.delete(`http://localhost:3000/api/tasks/${_id}`).subscribe({
        next: () => {
          console.log(`Task successfuly deleted with id: ${_id}`);
          this.tasks$.next(
            this.tasks$.value.filter((task) => task._id !== _id)
          );
          resolve();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    });
  }
  completeTask(_id: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    effect(() => {
      if (this.authService.userAuthenticated()) {
        this.getAllTask();
      }
    });
  }
}
