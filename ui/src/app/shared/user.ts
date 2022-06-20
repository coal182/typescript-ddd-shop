export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
  password?: string;
  dateOfBirth?: Date;
  version?: number;
}
