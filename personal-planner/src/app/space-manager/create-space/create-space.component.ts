import { Component, inject } from '@angular/core';
import { SpacesService } from '../../../adapters/spaces.service';

@Component({
  selector: 'app-create-space',
  imports: [],
  templateUrl: './create-space.component.html',
  styleUrl: './create-space.component.scss',
})
export class CreateSpaceComponent {
  private spaceService = inject(SpacesService);

  createSpace() {
    const spaceName = 'New Space'; // This should be replaced with actual input from the user
    this.spaceService.addSpace({ displayName: spaceName, _id: '' });
  }

  cancel() {
    console.log('Canceling space creation');
    // Logic to cancel space creation
  }
}
