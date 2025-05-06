import { effect, inject, Injectable, signal } from '@angular/core';
import { ITask } from '../app/interfaces/task.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks$ = new BehaviorSubject<ITask[]>([]);
  tasks = toSignal(this.tasks$, { initialValue: [] });

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

  addTask(task: ITask): void {
    this.http
      .post<{ message: string; task: ITask }>(
        `http://localhost:3000/api/tasks`,
        task
      )
      .subscribe({
        next: (data) => {
          this.tasks$.next([...this.tasks$.getValue(), data.task]);
        },
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
  }
    

  constructor(private http: HttpClient, private authService: AuthService) {
    effect(() => {
      if (this.authService.isLoggedInSignal()) {
        this.getAllTask();
      }
    });
  }
}
