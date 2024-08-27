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
  categoryName: string | null;
  isMature: boolean;
  readingTime: number;
  reads: number;
  chapters: ChapterCard[];
  author: {
    name: string | null;
    username: string | null;
    profile: string | null;
  };
};

export type ChapterCardWithPublish = ChapterCard & {
  published: boolean;
};

export type ChapterCard = {
  id: string;
  title: string | null;
  slug: string | null;
  isPremium: boolean;
  sn: number;
  createdAt: Date;
};

export type WorkDetails = {
  id: string;
  thumbnail: string;
  title: string;
  slug: string;
  reads: number;
  published: boolean;
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
  removeFromList: (id: string) => Promise<boolean>;
};

export type UploadedFile<T = unknown> = ClientUploadedFileData<T>;

export type User = {
  id: string;
  name: string;
  email: string;
  profile: string;
  emailVerified: boolean;
  username: string;
};

export type SearchByTitle = {
  id: string;
  title: string;
  slug: string;
};

export type TComment = {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    profile: string | null;
  };
  childrenCount: number;
  createdAt: Date;
};

export type UserProfile = {
  id: string;
  username: string;
  profile: string;
  name: string;
};

export type FollowersData = {
  followersCount: number;
  followers: {
    following: UserProfile;
  }[];
};

export type FollowingData = {
  followingCount: number;
  following: {
    follower: UserProfile;
  }[];
};
