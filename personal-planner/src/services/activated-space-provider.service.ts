import { effect, inject, Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivatedSpaceProviderService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  activatedSpaceId = new BehaviorSubject<string | null>(null);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.getChild(this.activatedRoute);
        child.paramMap.subscribe((params) => {
          this.activatedSpaceId.next(params.get('spaceId'));
        });
      });
  }

  private getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
