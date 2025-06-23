import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpacesService } from '../../adapters/spaces.service';
import { SpaceViewComponent } from '../space-view/space-view.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-inbox',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    FormsModule,
    MatTableModule,
    SpaceViewComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
})
export class InboxComponent {
  spacesService = inject(SpacesService);
  appSpaceService = inject(AppStateService);

  containerId = computed<string | undefined>(
    () => this.appSpaceService.inboxSpace()?._id
  );
}
