import { IBalance } from "./balance.interface";
import { ITimeFrameAvailabilityTemplate } from "./time-slot";

export interface ISettings {
  frameSettings: {
    availability: ITimeFrameAvailabilityTemplate;
    balances: IBalance[];
  };
}
