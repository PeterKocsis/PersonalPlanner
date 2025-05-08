import { Component, inject, input } from '@angular/core';
import { ISpace } from '../../interfaces/space.interface';
import { SpacesService } from '../../../services/spaces.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-space-item',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './space-item.component.html',
  styleUrl: './space-item.component.scss'
})
export class SpaceItemComponent {
  spaceService = inject(SpacesService);

  spaceItem = input.required<ISpace>();

  onDelete() {
    this.spaceService.deleteSpace(this.spaceItem()._id);
  }

}
