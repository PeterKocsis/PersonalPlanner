import { ITask } from './task.interface';

export interface ITaskQueue {
  dateOfQueue: Date;
  queue: ITask[];
}
