export interface IUser {
  id: number;
  studentNum: number;
  isStudent: boolean;
  departmentId: number;
  roleId: number;
  isRegistered: boolean;
  name: string;
  email: string;
  affiliation: string;
  isHost: boolean;
  picture: string;
}
