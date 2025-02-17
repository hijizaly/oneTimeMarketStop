import { User_role } from '@prisma/client';

export type TokenPayload = {
  id: number;
  mobile: string;
  email?: string;
  name: string;
  role: User_role;
};

export type jwtToken = {
  accessToken: string;
  refreshToken: string;
};
