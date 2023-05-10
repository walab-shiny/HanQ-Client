export interface IEvent {
  // closed: boolean;
  id: number;
  name: string;
  openAt: string;
  closeAt: string;
  location: string;
  maxUsers: number;
  content: string;
  availableTime: number;
  image: string;
  tags: { id: number; name: string }[];
}
