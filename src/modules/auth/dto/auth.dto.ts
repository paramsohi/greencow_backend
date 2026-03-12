export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserDto {
  id: number;
  email: string;
  role: string;
  profile: {
    fullName: string;
    phone?: string | null;
    businessName?: string | null;
    businessAddress?: string | null;
  } | null;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  tokens: AuthTokensDto;
}
