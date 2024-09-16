import { Role } from "./Role";
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}
