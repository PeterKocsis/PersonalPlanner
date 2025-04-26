import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, signal } from '@angular/core';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { ISpace } from '../app/spaces/interfaces/space.interface';

@Injectable({
  providedIn: 'root'
})
export class SpacesService implements OnInit {

  private subscriptions: Subscription[] = [];
  public spaces = signal<ISpace[]>([]);
  private _spaces$ = new BehaviorSubject<ISpace[]>([]);
  spaces$ = this._spaces$.asObservable();

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.updateSpaces();
  }

  updateSpaces() {
     this.subscriptions.push(this.http.get<{spaces: ISpace[]}>('http://localhost:3000/api/spaces')
     .subscribe({
      next: (data) => {
        this.spaces.update((old)=>old = data.spaces);
        this._spaces$.next(data.spaces);
      },
      error: (error) => {
        console.error('Error fetching spaces:', error);
      }
     }))
  }

  addSpace(space: ISpace ) {
    this.http.post<{message: string, spaceId: string}>('http://localhost:3000/api/spaces', space).subscribe({
      next: (data) => {
        const savedSpace = {...space, _id: data.spaceId};
        this.spaces.update((old)=>old = [...old, savedSpace]);
      },
      error: (error) => {
        console.error('Error creating space:', error);
      }
    });
  }

  deleteSpace(id: string) {
    this.http.delete(`http://localhost:3000/api/spaces/${id}`).subscribe({
      next: (data) => {
        this.spaces.update((old)=>old = old.filter(space => space._id !== id));
      },
      error: (error) => {
        console.error('Error deleting space:', error);
      }
    });
  }
}
