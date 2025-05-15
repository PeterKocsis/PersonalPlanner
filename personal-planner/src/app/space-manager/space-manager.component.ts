import { Component, inject, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { SpacesService } from '../../adapters/spaces.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ISpace } from '../interfaces/space.interface';
import { MatButton } from '@angular/material/button';
import { SpaceItemComponent } from './space-item/space-item.component';

@Component({
  selector: 'app-space-manager',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
    SpaceItemComponent,
  ],
  templateUrl: './space-manager.component.html',
  styleUrl: './space-manager.component.scss',
})
export class SpaceManagerComponent {
  spaceService = inject(SpacesService);
  spaces = this.spaceService.spaces;
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
