import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  getMatIconNameNotFoundError,
  MatIconModule,
} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-month-selector',
  imports: [MatButtonModule, MatIconModule, MatInputModule, CommonModule],
  templateUrl: './month-selector.component.html',
  styleUrl: './month-selector.component.scss',
})
export class MonthSelectorComponent {
  initialDate = input.required<Date>();
  selectedDate = signal<Date>(new Date());
  selectedDateChanaged = output<Date>();

  constructor() {
    effect(() => {
      this.selectedDate.set(this.initialDate());
    });
    effect(() => {
      this.selectedDateChanaged.emit(this.selectedDate());
    }
    );
  }
  
  onIncrementMonth() {
    this.selectedDate.update((previous) => {
      const currentMonth = previous.getMonth();
      const currentYear = previous.getFullYear();
      const nextMonth = new Date(currentYear, currentMonth + 1, 1);
      return nextMonth;
    });
  }
  onDecrementMonth() {
    this.selectedDate.update((previous) => {
      const currentMonth = previous.getMonth();
      const currentYear = previous.getFullYear();
      const previousMonth = new Date(currentYear, currentMonth - 1, 1);
      return previousMonth;
    });
  }
}
