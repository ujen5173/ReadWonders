export type SupabaseUser = {
  iss: string;
  sub: string;
  name: string;
  email: string;
  picture: string;
  full_name: string;
  avatar_url: string;
  provider_id: string;
  email_verified: boolean;
  phone_verified: boolean;
};
