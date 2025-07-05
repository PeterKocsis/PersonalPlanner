import { Component, inject } from '@angular/core';
import {
  MatListItemTitle,
  MatListModule,
} from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppStateService } from '../../../services/app-state.service';

// This component is responsible for displaying the spaces in the application.
// It will use the SpacesService to fetch and display the spaces.
// The component will also handle any user interactions related to spaces.
// The component will be responsible for displaying the spaces in a list or grid format.
// It will also handle any user interactions related to spaces, such as selecting a space or creating a new space.
@Component({
  selector: 'app-space-panel',
  imports: [
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    
  ],
  templateUrl: './space-panel.component.html',
  styleUrl: './space-panel.component.scss',
})
export class SpacePanelComponent {
  appStateService = inject(AppStateService);
  spaces = this.appStateService.spaces;
}
