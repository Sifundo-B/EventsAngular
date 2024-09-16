export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
  success: boolean;
  message: string;
}
