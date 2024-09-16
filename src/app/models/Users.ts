import { Role } from "./Role";
export interface Users {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  image: string | null;
  password: string;
  confirmPassword: string;
  role: Role;
  packageType: string; // Added field for package type
  isPremium: boolean; // Added field for premium status
  accessGranted: boolean; // Added field for access management
}