import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpacePanelComponent } from './navigation-panel/space-panel/space-panel.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { NavigationPanelComponent } from './navigation-panel/navigation-panel.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationPanelComponent,
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
