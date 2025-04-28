import { Component, inject, OnInit } from '@angular/core';
import { SpacesService } from '../../../services/spaces.service';
import { CreateSpaceComponent } from '../create-space/create-space.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// This component is responsible for displaying the spaces in the application.
// It will use the SpacesService to fetch and display the spaces.
// The component will also handle any user interactions related to spaces.
// The component will be responsible for displaying the spaces in a list or grid format.
// It will also handle any user interactions related to spaces, such as selecting a space or creating a new space.
@Component({
  selector: 'app-spaces-list',
  imports: [
    CreateSpaceComponent,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './spaces-list.component.html',
  styleUrl: './spaces-list.component.scss',
})
export class SpaceListComponent implements OnInit {
  private spacesService = inject(SpacesService);
  spaces = this.spacesService.spaces;

  ngOnInit(): void {
    this.spacesService.updateSpaces();
  }
}
