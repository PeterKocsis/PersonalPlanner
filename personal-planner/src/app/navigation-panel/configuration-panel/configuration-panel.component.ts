import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-configuration-panel',
  imports: [MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './configuration-panel.component.html',
  styleUrl: './configuration-panel.component.scss',
})
export class ConfigurationPanelComponent {}
