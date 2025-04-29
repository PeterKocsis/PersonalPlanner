import { Component, inject, OnInit } from '@angular/core';
import { SpacesService } from '../../../services/spaces.service';
import {
  MatListItemMeta,
  MatListItemTitle,
  MatListModule,
} from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
    MatListItemTitle,
    MatListItemMeta,
  ],
  templateUrl: './space-panel.component.html',
  styleUrl: './space-panel.component.scss',
})
export class SpacePanelComponent implements OnInit {
  private spacesService = inject(SpacesService);
  spaces = this.spacesService.spaces;

  ngOnInit(): void {
    this.spacesService.updateSpaces();
  }
}
