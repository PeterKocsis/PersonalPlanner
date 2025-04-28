import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpaceListComponent } from './spaces/space-list/spaces-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SpaceListComponent,
    MatSidenavModule,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'personal-planner';
}
