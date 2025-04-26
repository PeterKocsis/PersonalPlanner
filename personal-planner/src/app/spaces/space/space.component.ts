import { Component, inject, input } from '@angular/core';
import { ISpace } from '../interfaces/space.interface';
import { SpacesService } from '../../../services/spaces.service';

@Component({
  selector: 'app-space',
  imports: [],
  templateUrl: './space.component.html',
  styleUrl: './space.component.scss'
})
export class SpaceComponent {
  private spaceService = inject(SpacesService);

  space = input.required<ISpace>()

  onDeleteSpace(id: string) {
    this.spaceService.deleteSpace(id);
  }

  editSpace(id: string) {
    console.log('Editing space');
    // Logic to edit the space
  }

}
