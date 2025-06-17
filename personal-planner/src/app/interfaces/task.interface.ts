export interface ITask {
  _id: string;
  title?: string;
  description?: string;
  createdAt: Date;
  spaceId?: string;
  timeToCompleteMinutes?: number;
  taskPocketRangeId?: string;
  completed: boolean;
}
