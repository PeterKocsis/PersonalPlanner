export interface ITask {
  completed: boolean;
  _id: string;
  title: string;
  description?: string;
  createdAt?: Date;
  spaceId: string;
  timeToCompleteMinutes?: number;
}
