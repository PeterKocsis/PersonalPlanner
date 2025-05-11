import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SpacesService } from '../../services/spaces.service';
import { SpaceViewComponent } from '../space-view/space-view.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';

@Component({
  selector: 'app-inbox',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
    MatTableModule,
    SpaceViewComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TaskListItemComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
})
export class InboxComponent {
  spacesService = inject(SpacesService);

  containerId = computed<string | undefined>(
    () => this.spacesService.inboxSpace()?._id
  );
}
