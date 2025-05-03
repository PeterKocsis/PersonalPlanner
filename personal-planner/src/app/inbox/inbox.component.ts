import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ITask } from '../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { SpacesService } from '../../services/spaces.service';
import { SpaceViewComponent } from '../space-view/space-view.component';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-inbox',
  imports: [
    MatFormFieldModule,
    DragDropModule,
    MatInput,
    FormsModule,
    MatButton,
    SpaceViewComponent,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
})
export class InboxComponent {
  spacesService = inject(SpacesService);

  containerId = computed<string | undefined>(()=> this.spacesService.inboxSpace()?._id);
}
