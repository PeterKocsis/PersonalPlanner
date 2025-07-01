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
  useRatio: number;
}
