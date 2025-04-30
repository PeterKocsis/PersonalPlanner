import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-quick-access-panel',
  imports: [MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './quick-access-panel.component.html',
  styleUrl: './quick-access-panel.component.scss'
})
export class QuickAccessPanelComponent {

}
