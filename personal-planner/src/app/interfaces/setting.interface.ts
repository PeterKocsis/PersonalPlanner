import { ITimeFrameAvailabilityTemplate } from "./time-slot";

export interface ISettings {
  frameSettings: {
    availability: ITimeFrameAvailabilityTemplate;
  };
}
