import { HttpClient } from '@angular/common/http';
import { effect, Injectable, OnInit, signal } from '@angular/core';
import { BehaviorSubject, filter, map, Subject, Subscription } from 'rxjs';
import { ISpace } from '../app/interfaces/space.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  private subscriptions: Subscription[] = [];
  private _allSpaces$ = new BehaviorSubject<ISpace[]>([]);
  allSpaces$ = this._allSpaces$.asObservable();
  private _inboxSpace = this.allSpaces$.pipe(
    map((space) => space.filter((s) => s.displayName === 'Inbox')[0])
  );
  public userSpaces = this.allSpaces$.pipe(map((spaces) => spaces.filter((s) => s.displayName !== 'Inbox')));
  public spaces = toSignal(this.userSpaces, { initialValue: [] });
  public inboxSpace = toSignal(this._inboxSpace, { initialValue: null });
  constructor(private http: HttpClient, private authService: AuthService) {
    effect(() => {
      if (this.authService.isLoggedInSignal()) {
        this.getSpaces();
      }
    });
  }

  getSpaces() {
    this.subscriptions.push(
      this.http
        .get<{ spaces: ISpace[] }>('http://localhost:3000/api/spaces')
        .subscribe({
          next: (data) => {
            console.log('Fetched spaces:', data.spaces);
            this._allSpaces$.next(data.spaces);
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
          this._allSpaces$.next([...this._allSpaces$.getValue(), data.newSpace]);
        },
        error: (error) => {
          console.error('Error creating space:', error);
        },
      });
  }

  deleteSpace(id: string) {
    this.http.delete(`http://localhost:3000/api/spaces/${id}`).subscribe({
      next: (data) => {
        this._allSpaces$.next(
          this._allSpaces$.getValue().filter((space) => space._id !== id))
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
          this._allSpaces$.next(spaces);
        },
        error: (error) => {
          console.error('Error updating space priority:', error);
        },
      });
  }
}
