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
  selectedDate = signal<{startDate: Date, endDate: Date}>((()=>{
    return this.getRange(new Date());
  })());
  selectedDateChanaged = output<{startDate: Date, endDate: Date}>();

  constructor() {
    effect(() => {
      this.selectedDateChanaged.emit(this.selectedDate());
    });
  }

  private getRange(currentDate: Date) {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    return {startDate: startOfMonth, endDate: endOfMonth};
  }
  
  onIncrementMonth() {
    this.selectedDate.update((previous) => {
      const currentMonth = previous.startDate.getMonth();
      const currentYear = previous.startDate.getFullYear();
      const nextMonth = new Date(currentYear, currentMonth + 1, 1);
      return this.getRange(nextMonth);
    });
  }
  onDecrementMonth() {
    this.selectedDate.update((previous) => {
      const currentMonth = previous.startDate.getMonth();
      const currentYear = previous.startDate.getFullYear();
      const previousMonth = new Date(currentYear, currentMonth - 1, 1);
      return this.getRange(previousMonth);
    });
  }
}
