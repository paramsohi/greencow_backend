export interface UserProfileDto {
  id: number;
  email: string;
  role: string;
  profile: {
    fullName: string;
    phone: string | null;
    businessName: string | null;
    businessAddress: string | null;
  } | null;
}
