import { Component, computed, inject, signal } from '@angular/core';
import { DailyTimeSlotEditorComponent } from '../daily-time-slot-editor/daily-time-slot-editor.component';
import {
  ITimeSlot,
} from '../../interfaces/time-slot';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../../services/app-state.service';
import { SettingsAdapterService } from '../../../adapters/settings-adapter.service';

@Component({
  selector: 'app-availability-editor',
  imports: [
    DailyTimeSlotEditorComponent,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './availability-editor.component.html',
  styleUrl: './availability-editor.component.scss',
})
export class AvailabilityEditorComponent {
  private appStateService = inject(AppStateService);
  private settingsAdapterService = inject(SettingsAdapterService);

  showUnavailableDays = signal<boolean>(false);

  timeFrameAvailability = computed(()=>{
    console.log('Settings changes', this.appStateService.settings());
    return this.appStateService.settings()!.frameSettings.availability;
  });

  dailyAvailabilities = computed(() => {
    console.log('Availablitiy changed');
    return this.timeFrameAvailability().dailyAvailabilities;
  });

  countAvailableDays = computed(() => {
    return this.showUnavailableDays()
      ? 7
      : this.dailyAvailabilities().filter(
          (availability) => availability.isAvailable
        ).length;
  });
  plannedTimePortion: number = 0.5;

  onTimeSlotChanged(changedDayTimeSlots: ITimeSlot[], dayIndex: number) {
    this.settingsAdapterService.updateTimeSlots(changedDayTimeSlots, dayIndex);
  }
  onAvailabilityChanged($event: boolean, dayIndex: number) {
    this.settingsAdapterService.updateAvailability($event, dayIndex);
  }

  totalAvailableTime = computed((): number => {
    return this.dailyAvailabilities().reduce((total, availability) => {
      if (availability.isAvailable) {
        return (
          total +
          availability.timeSlots.reduce(
            (dayTotal, slot) =>
              dayTotal +
              (slot.end.hour - slot.start.hour) * 60 +
              (slot.end.minutes - slot.start.minutes),
            0
          )
        );
      }
      return total;
    }, 0);
  });

  toggleDisplayUnavailableDays() {
    this.showUnavailableDays.update((current) => !current);
  }
}
