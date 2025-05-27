import { ITaskQueue } from './task-queue.interface';
import { ITask } from './task.interface';

export interface ITimeFrame {
  _id: string;
  index: number;
  startDate: Date;
  endDate: Date;
  unscheduledTasks: ITask[];
  taskQueues: ITaskQueue[];
}
