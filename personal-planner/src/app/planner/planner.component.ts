import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MonthSelectorComponent } from '../month-selector/month-selector.component';
import { IWeek } from '../interfaces/week.interface';
import { TimeFrameViewerComponent } from '../time-frame-viewer/time-frame-viewer.component';

@Component({
  selector: 'app-planner',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    MonthSelectorComponent,
    TimeFrameViewerComponent
  ],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss'
})
export class PlannerComponent implements AfterViewInit {
  @ViewChild('cardHeader') cardHeaderElement!: ElementRef<HTMLElement>;

onDateChanged(date: Date) {
  this.weeksOfMonth = this.getWeeksofMonth(date.getFullYear(), date.getMonth());
}
  dateOfToday: Date = new Date();
  weeksOfYear: IWeek[] = [];
  weeksOfMonth: IWeek[] = [];
  constructor() {
    this.weeksOfMonth = this.getWeeksofMonth(
      this.dateOfToday.getFullYear(),
      this.dateOfToday.getMonth()
    );
  }

  titleWidth = '100px';
  ngAfterViewInit(): void {
    console.log((this.cardHeaderElement.nativeElement.getBoundingClientRect().width));

  }


  getWeeksofMonth(
    year: number,
    month: number
  ): { weekNumber: number; startDate: Date; endDate: Date }[] {
    const weeks: { weekNumber: number; startDate: Date; endDate: Date }[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    let firstDayOfWeek = this.getTheStartOfWeek(firstDayOfMonth);
    let lastDayOfWeekInMonth = this.getTheEndOfWeek(lastDayOfMonth);
    let weekNumber = this.getWeekNumber(firstDayOfWeek);
    while (firstDayOfWeek < lastDayOfWeekInMonth) {
      const startDate = new Date(firstDayOfWeek);
      const endDate = new Date(firstDayOfWeek);
      endDate.setDate(endDate.getDate() + 6);
      if( startDate.getFullYear() !== endDate.getFullYear() && endDate.getMonth() === 0 ) {
        weekNumber = 1;
      } else {
        weekNumber++;
        
      }
      weeks.push({
        weekNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
      firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
    }
    return weeks;
  }

  isMonday (date: Date): boolean {
    return date.getDay() === 1;
  }

  isSunday (date: Date): boolean {
    return date.getDay() === 0;
  }

  getTheStartOfWeek(date: Date): Date {
    if (this.isMonday(date)) {
      return date;
    }
    // If the date is not a Monday, find the previous Monday
    const day = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust for Sunday (0) to be the last day of the week

    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
    return startOfWeek;
  }

  getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    while (startOfYear.getDay() !== 1) {
      startOfYear.setDate(startOfYear.getDate() + 1);
    }
    // Calculate the number of days between the start of the year and the given date
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    // Calculate the week number
    const weekNumber = Math.floor(days / 7) + 1;
    return weekNumber;
  }

  getTheEndOfWeek(date: Date): Date {
    if (this.isSunday(date)) {
      return date;
    }
    // If the date is not a Monday, find the next Sunday
    const addNumberOfDays = 6 - date.getDay();

    const endOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + addNumberOfDays);
    if (date.getMonth() !== endOfWeek.getMonth()) {
      endOfWeek.setDate(0);
    }
    const startOfWeek = this.getTheStartOfWeek(endOfWeek);
    return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() - 1);
  }
}
