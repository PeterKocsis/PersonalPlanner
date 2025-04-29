import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  sideNavigationOpened = false

  @Output()
  sideNavOpen = new EventEmitter<boolean>();

  onToggleNavigationPanel() {
    this.sideNavigationOpened = !this.sideNavigationOpened
    this.sideNavOpen.emit(this.sideNavigationOpened);
  }
}
