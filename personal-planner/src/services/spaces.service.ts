import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, signal } from '@angular/core';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { ISpace } from '../app/interfaces/space.interface';
import { Q } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  private subscriptions: Subscription[] = [];
  public spaces = signal<ISpace[]>([]);
  private _spaces$ = new BehaviorSubject<ISpace[]>([]);
  spaces$ = this._spaces$.asObservable();

  constructor(private http: HttpClient) {
    this.getSpaces();
  }

  getSpaces() {
    this.subscriptions.push(
      this.http
        .get<{ spaces: ISpace[] }>('http://localhost:3000/api/spaces')
        .subscribe({
          next: (data) => {
            console.log('Fetched spaces:', data.spaces);
            this.spaces.update((old) => (old = data.spaces));
            this._spaces$.next(data.spaces);
          },
          error: (error) => {
            console.error('Error fetching spaces:', error);
          },
        })
    );
  }

  addSpace(spaceName: string) {
    this.http
      .post<{ message: string; newSpace: ISpace }>(
        'http://localhost:3000/api/spaces',
        { displayName: spaceName }
      )
      .subscribe({
        next: (data) => {
          this.spaces.update((old) => (old = [...old, data.newSpace]));
        },
        error: (error) => {
          console.error('Error creating space:', error);
        },
      });
  }

  deleteSpace(id: string) {
    this.http.delete(`http://localhost:3000/api/spaces/${id}`).subscribe({
      next: (data) => {
        this.spaces.update(
          (old) => (old = old.filter((space) => space._id !== id))
        );
      },
      error: (error) => {
        console.error('Error deleting space:', error);
      },
    });
  }

  updateSpacePriorityList(spaces: ISpace[]) {
    this.http.put('http://localhost:3000/api/spacePriority', spaces.map(space => space._id)).subscribe({
      next: (data) => {
        this.spaces.update((old) => (old = spaces));
      },
      error: (error) => {
        console.error('Error updating space priority:', error);
      },
    });
  }
}
