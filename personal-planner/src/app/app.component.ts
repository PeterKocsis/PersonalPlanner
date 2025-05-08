import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { NavigationPanelComponent } from './navigation-panel/navigation-panel.component';
import { AuthService } from './auth/auth.service';

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
export class AppComponent implements OnInit {
  title = 'personal-planner';

  private authService = inject(AuthService);
  isLoggedIn = this.authService.userAuthenticated();
  @ViewChild('drawer', { static: true }) navigationPanel!: MatDrawer;

  constructor() {
    effect(() => {
      if (this.authService.userAuthenticated()) {
        if (!this.navigationPanel.opened) {
          this.navigationPanel.open();
        }
      } else {
        this.navigationPanel.close();
      }
    });
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
