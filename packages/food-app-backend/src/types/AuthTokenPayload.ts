import { Role } from 'src/enums/role.enum';

export default interface AuthTokenPayload {
  userId: string;
  email: string;
  roles: Role[];
}
