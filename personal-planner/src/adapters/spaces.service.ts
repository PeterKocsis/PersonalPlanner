import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ISpace } from '../app/interfaces/space.interface';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  private http = inject(HttpClient);

  public spaces$ = new BehaviorSubject<ISpace[]>([]);
  public inboxSpace$ = new BehaviorSubject<ISpace | undefined>(undefined);

  getInbox(): void {
    this.http
      .get<{ message: string; inboxSpace: ISpace }>(
        'http://localhost:3000/api/spaces/inbox'
      )
      .pipe(
        map((response) => {
          if (!response.inboxSpace || !response.inboxSpace._id) {
            throw new Error('Invalid inbox space data received');
          }
          return response.inboxSpace;
        })
      )
      .subscribe({
        next: (inbox) => {
          this.inboxSpace$.next(inbox);
        },
        error: (error) => {
          this.inboxSpace$.error(error);
        },
      });
  }

  getSpaces(): void {
    this.http
      .get<{ spaces: ISpace[] }>('http://localhost:3000/api/spaces')
      .pipe(map((response) => response.spaces))
      .subscribe({
        next: (spaces) => {
          console.log('Fetched spaces:', spaces);
          this.spaces$.next(spaces);
        },
        error: (error) => {
          console.error(`Failed to fetch spaces with prio: ${error}`);
          this.spaces$.error(error);
        },
      });
  }

  addSpace(spaceName: string) {
    this.http
      .post<{ message: string; newSpace: ISpace }>(
        'http://localhost:3000/api/spaces',
        { displayName: spaceName }
      )
      .pipe(map((response) => response.newSpace))
      .subscribe({
        next: (newSpace) => {
          const mergedSpaces = [...this.spaces$.value, newSpace];
          this.spaces$.next(mergedSpaces);
        },
        error: (error) => {
          this.spaces$.error(error);
        },
      });
  }

  deleteSpace(id: string) {
    this.http.delete(`http://localhost:3000/api/spaces/${id}`).subscribe({
      next: (data) => {
        const updatedSpaces = this.spaces$.value.filter(
          (space) => space._id !== id
        );
        this.spaces$.next(updatedSpaces);
      },
      error: (error) => {
        this.spaces$.error(error);
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
          this.spaces$.next([...spaces]);
        },
        error: (error) => {
          this.spaces$.error(error);
        },
      });
  }
}
