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

export type TCoverCard = {
  id: string;
  thumbnail: string;
  title: string;
  slug: string;
};

export type TCard = {
  id: string;
  description: string;
  slug: string;
  title: string;
  thumbnail: string;
  love: number;
  tags: string[];
  isPremium: boolean;
  categoryName: string | null;
  isMature: boolean;
  reads: number;
  chapters: {
    id: string;
    title: string | null;
    slug: string | null;
    createdAt: Date;
  }[];
  author: {
    name: string | null;
    username: string | null;
    profile: string | null;
  };
};

export type WorkDetails = {
  id: string;
  thumbnail: string;
  title: string;
  slug: string;
  reads: number;
  views: number;
  total_chapters: number;
};

export type TReadingListCard = {
  stories: {
    thumbnail: string;
  }[];
  id: string;
  slug: string;
  title: string;
  description: string | null;
};

export type RootContextType = {
  activeBook: TCard | null;
  setActiveBook: React.Dispatch<React.SetStateAction<TCard | null>>;
};

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

export type User = {
  id: string;
  name: string | null;
  username: string | null;
  profile: string | null;
  email: string | null;
};

export type SearchByTitle = {
  id: string;
  title: string;
  slug: string;
};
