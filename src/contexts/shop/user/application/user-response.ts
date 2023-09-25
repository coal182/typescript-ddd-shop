import { User } from '../domain/user';

export interface UserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  password: string;
}

export class UsersResponse {
  public readonly users: Array<UserResponse>;

  constructor(users: Array<User>) {
    this.users = users.map((user) => {
      const primitives = user.toPrimitives();
      return {
        id: primitives.id,
        email: primitives.email,
        firstname: primitives.firstname,
        lastname: primitives.lastname,
        dateOfBirth: primitives.dateOfBirth,
        password: primitives.password, // TODO: It's a leak, but necessary on user controller comparing passwords, thinking on something
      };
    });
  }
}
