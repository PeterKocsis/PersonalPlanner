export interface ITimeSlot {
  start: {
    hour: number;
    minutes: number;
  };
  end: {
    hour: number;
    minutes: number;
  };
};

export interface IDailyAvailability {
  dayIndex: number;
  timeSlots: ITimeSlot[];
  isAvailable: boolean;
}

export interface ITimeFrameAvailabilityTemplate {
  name: string;
  description?: string;
  dailyAvailabilities: IDailyAvailability[];
  totalAvailableTime?: number; // Total time available for tasks in minutes
  useRatio: number;
  allocatableTime?: number; // Total available time * useRation in minutes
}
