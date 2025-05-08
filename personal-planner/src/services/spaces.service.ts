import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { ISpace } from '../app/interfaces/space.interface';
import { AuthService } from '../app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  public spaces = signal<ISpace[]>([]);
  public inboxSpace = signal<ISpace | undefined>(undefined);
  constructor(private http: HttpClient, private authService: AuthService) {
    effect(async () => {
      if (this.authService.userAuthenticated()) {
        this.spaces.set(await this.getSpaces());
        this.inboxSpace.set(await this.getInbox());
      }
    });
  }

  getInbox(): Promise<ISpace> {
    return new Promise<ISpace>((resolve, reject) => {
      this.http
        .get<{ message: string; inboxSpace: ISpace }>(
          'http://localhost:3000/api/spaces/inbox'
        )
        .subscribe({
          next: (response) => {
            resolve(response.inboxSpace);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  private getSpaces(): Promise<ISpace[]> {
    return new Promise<ISpace[]>((resolve, reject) => {
      this.http
        .get<{ spaces: ISpace[] }>('http://localhost:3000/api/spaces')
        .subscribe({
          next: (data) => {
            console.log('Fetched spaces:', data.spaces);
            resolve(data.spaces);
          },
          error: (error) => {
            console.error(`Failed to fetch spaces with prio: ${error}`);
            reject(error);
          },
        });
    });
  }

  addSpace(spaceName: string) {
    this.http
      .post<{ message: string; newSpace: ISpace }>(
        'http://localhost:3000/api/spaces',
        { displayName: spaceName }
      )
      .subscribe({
        next: (data) => {
          this.spaces.update((old) => [...old, data.newSpace]);
        },
        error: (error) => {
          console.error('Error creating space:', error);
        },
      });
  }

  deleteSpace(id: string) {
    this.http.delete(`http://localhost:3000/api/spaces/${id}`).subscribe({
      next: (data) => {
        this.spaces.update((previous) =>
          previous.filter((space) => space._id !== id)
        );
      },
      error: (error) => {
        console.error('Error deleting space:', error);
      },
    });
  }

  updateSpacePriorityList(spaces: ISpace[]) {
    this.http
      .put(
        'http://localhost:3000/api/spacePriority',
        spaces.map((space) => space._id)
      )
      .subscribe({
        next: (data) => {
          this.spaces.set(spaces);
        },
        error: (error) => {
          console.error('Error updating space priority:', error);
        },
      });
  }
}
