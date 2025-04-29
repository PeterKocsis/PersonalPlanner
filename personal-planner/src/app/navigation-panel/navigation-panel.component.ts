import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SpacePanelComponent } from './space-panel/space-panel.component';
import { ConfigurationPanelComponent } from './configuration-panel/configuration-panel.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-panel',
  imports: [
    MatDivider,
    MatListModule,
    SpacePanelComponent,
    ConfigurationPanelComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.scss',
})
export class NavigationPanelComponent {}
