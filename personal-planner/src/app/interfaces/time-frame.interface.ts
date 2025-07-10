import { ITaskQueue } from './task-queue.interface';
import { ITask } from './task.interface';

export interface ITimeFrame {
  year: number;
  index: number;
  startDate: Date;
  endDate: Date;
  pocketsTasks: string[];
  taskQueues?: ITaskQueue[];
}
