import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SpacePanelComponent } from './space-panel/space-panel.component';
import { ConfigurationPanelComponent } from './configuration-panel/configuration-panel.component';
import { QuickAccessPanelComponent } from './quick-access-panel/quick-access-panel.component';

@Component({
  selector: 'app-navigation-panel',
  imports: [
    MatDivider,
    MatListModule,
    SpacePanelComponent,
    ConfigurationPanelComponent,
    QuickAccessPanelComponent
  ],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.scss',
})
export class NavigationPanelComponent {}
