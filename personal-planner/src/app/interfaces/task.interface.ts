import { ITimeRange } from "./time-range.interface";

export interface ITask {
  _id: string;
  title?: string;
  description?: string;
  createdAt: Date;
  spaceId?: string;
  timeToCompleteMinutes?: number;
  assignedTimeRange?: ITimeRange;
  completed: boolean;
}
