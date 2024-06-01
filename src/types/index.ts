import { type ClientUploadedFileData } from "uploadthing/types";

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

export type TCard = {
  id: string;
  description: string;
  slug: string;
  title: string;
  thumbnail: string;
  tags: string[];
  isPremium: boolean;
  category: string | null;
  isMature: boolean;
  reads: number;
  author: {
    name: string | null;
  };
};

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}
