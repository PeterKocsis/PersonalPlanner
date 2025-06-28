import {
  Component,
  inject,
} from '@angular/core';
import {
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { SpacesService } from '../../adapters/spaces.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { SpaceItemComponent } from './space-item/space-item.component';
import { AppStateService } from '../../services/app-state.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AvailabilityEditorComponent } from './availability-editor/availability-editor.component';

@Component({
  selector: 'app-space-manager',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
    SpaceItemComponent,
    MatTabsModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    AvailabilityEditorComponent
  ],
  templateUrl: './space-manager.component.html',
  styleUrl: './space-manager.component.scss',
})
export class SpaceManagerComponent {
  spaceService = inject(SpacesService);
  appStateService = inject(AppStateService);

  spaces = this.appStateService.spaces;
  newSpaceName: string = '';

  drop(event: any) {
    const spaceCopy = [...this.spaces()];
    moveItemInArray(spaceCopy, event.previousIndex, event.currentIndex);
    this.spaceService.updateSpacePriorityList(spaceCopy);
  }

  addSpace() {
    if (this.newSpaceName) {
      this.spaceService.addSpace(this.newSpaceName);
    }
  }
}
