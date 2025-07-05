import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  ITimeFrameAvailabilityTemplate,
  ITimeSlot,
} from '../app/interfaces/time-slot';
import { BehaviorSubject, map, of } from 'rxjs';
import { ISettings } from '../app/interfaces/setting.interface';
import { IBalance } from '../app/interfaces/balance.interface';
import { AppStateService } from '../services/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsAdapterService {
  private http = inject(HttpClient);
  settings$ = new BehaviorSubject<ISettings | undefined>(undefined);

  constructor() {}

  getSettingsFromServer() {
    this.http.get<{message: string, settings: ISettings}>('http://localhost:3000/api/settings').pipe(
      map(response => {
        if (!response.settings) {
          throw new Error('Settings not found');
        }
        return response.settings;
      })
    ).subscribe({
      next: (settings) => {
        this.settings$.next(settings);
      },
      error: (error) => {
        console.error('Failed to fetch settings:', error);
        this.settings$.error(error);
      }
    }
    )
  }
  
  updateTimeSlots(changedDayTimeSlots: ITimeSlot[], dayIndex: number) {
    if (this.settings$.value) {
      const settingsClone = structuredClone(this.settings$.value);
      const modifiedDailyAvailabilities =
      settingsClone.frameSettings.availability.dailyAvailabilities.map(
        (availability, index) =>
          index === dayIndex
        ? { ...availability, timeSlots: changedDayTimeSlots }
        : availability
      );
      settingsClone.frameSettings.availability.dailyAvailabilities =
      modifiedDailyAvailabilities;
      this.http.put<{message: string, settings: ISettings}>('http://localhost:3000/api/settings', {settings: {...settingsClone}}).pipe(
        map(response => {
          if (!response.settings) {
            throw new Error('Settings not found');
          }
          return response.settings;
        })
      ).subscribe({
        next: (settings) => {
          this.settings$.next(settings);
        },
        error: (error) => {
          console.error('Failed to update settings:', error);
          this.settings$.error(error);
        }
      });
    }
  }
  
  updateAvailability(availability: boolean, dayIndex: number) {
    if(this.settings$.value) {
      const settingsClone = structuredClone(this.settings$.value);
      const targetDay = settingsClone.frameSettings.availability.dailyAvailabilities.find((item)=>item.dayIndex === dayIndex);
      if(targetDay) {
        targetDay.isAvailable = availability;
        this.http.put<{message: string, settings: ISettings}>('http://localhost:3000/api/settings', {settings: {...settingsClone}}).pipe(
          map(response => {
            if (!response.settings) {
              throw new Error('Settings not found');
            }
            return response.settings;
          })
        ).subscribe({
          next: (settings) => {
            this.settings$.next(settings);
          },
          error: (error) => {
            console.error('Failed to update settings:', error);
            this.settings$.error(error);
          }
        });
        this.settings$.next(settingsClone);
      }
    }
  }

  updateUseRatio(value: number) {
    if (this.settings$.value) {
      const settingsClone = structuredClone(this.settings$.value);
      settingsClone.frameSettings.availability.useRatio = value;
      this.http.put<{message: string, settings: ISettings}>('http://localhost:3000/api/settings', {settings: {...settingsClone}}).pipe(
        map(response => {
          if (!response.settings) {
            throw new Error('Settings not found');
          }
          return response.settings;
        })
      ).subscribe({
        next: (settings) => {
          this.settings$.next(settings);
        },
        error: (error) => {
          console.error('Failed to update settings:', error);
          this.settings$.error(error);
        }
      });
    }
  }

  updateBalances(balances: IBalance[]) {
    if (this.settings$.value) {
      const settingsClone = structuredClone(this.settings$.value);
      settingsClone.frameSettings.balances = balances;
      this.http.put<{message: string, settings: ISettings}>('http://localhost:3000/api/settings', {settings: {...settingsClone}}).pipe(
        map(response => {
          if (!response.settings) {
            throw new Error('Settings not found');
          }
          return response.settings;
        })
      ).subscribe({
        next: (settings) => {
          this.settings$.next(settings);
        },
        error: (error) => {
          console.error('Failed to update settings:', error);
          this.settings$.error(error);
        }
      });
    }
  }
}
