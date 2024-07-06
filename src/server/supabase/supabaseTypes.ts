export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _CurrentReadsToStory: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_CurrentReadsToStory_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "current_reads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_CurrentReadsToStory_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      _ReadingListToStory: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ReadingListToStory_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "reading_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ReadingListToStory_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmark: {
        Row: {
          createdAt: string
          id: string
          storyId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          storyId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          storyId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_storyId_fkey"
            columns: ["storyId"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmark_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter: {
        Row: {
          content: Json | null
          createdAt: string
          id: string
          isDeleted: boolean
          published: boolean
          reads: number
          slug: string | null
          storyId: string
          thumbnail: string | null
          time: number
          title: string | null
          updatedAt: string
        }
        Insert: {
          content?: Json | null
          createdAt?: string
          id: string
          isDeleted?: boolean
          published?: boolean
          reads?: number
          slug?: string | null
          storyId: string
          thumbnail?: string | null
          time?: number
          title?: string | null
          updatedAt: string
        }
        Update: {
          content?: Json | null
          createdAt?: string
          id?: string
          isDeleted?: boolean
          published?: boolean
          reads?: number
          slug?: string | null
          storyId?: string
          thumbnail?: string | null
          time?: number
          title?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_storyId_fkey"
            columns: ["storyId"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      current_reads: {
        Row: {
          createdAt: string
          id: string
          storyId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          storyId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          storyId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "current_reads_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion: {
        Row: {
          content: string
          createdAt: string
          id: string
          storyId: string
          title: string
        }
        Insert: {
          content: string
          createdAt?: string
          id: string
          storyId: string
          title: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          storyId?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_storyId_fkey"
            columns: ["storyId"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      genre: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          name: string
          slug: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          createdAt: string
          email: string | null
          id: string
          name: string | null
          profile: string | null
          tagline: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          createdAt?: string
          email?: string | null
          id: string
          name?: string | null
          profile?: string | null
          tagline?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          name?: string | null
          profile?: string | null
          tagline?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_list: {
        Row: {
          authorId: string
          createdAt: string
          description: string | null
          id: string
          private: boolean
          slug: string
          title: string
        }
        Insert: {
          authorId: string
          createdAt?: string
          description?: string | null
          id: string
          private?: boolean
          slug: string
          title: string
        }
        Update: {
          authorId?: string
          createdAt?: string
          description?: string | null
          id?: string
          private?: boolean
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recommended: {
        Row: {
          createdAt: string
          id: string
          storyId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          storyId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          storyId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommended_storyId_fkey"
            columns: ["storyId"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommended_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story: {
        Row: {
          authorId: string
          categoryName: string | null
          createdAt: string
          description: string
          id: string
          isDeleted: boolean
          isMature: boolean
          isPremium: boolean
          published: boolean
          reads: number
          slug: string
          tags: string[] | null
          thumbnail: string
          title: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          categoryName?: string | null
          createdAt?: string
          description: string
          id: string
          isDeleted?: boolean
          isMature?: boolean
          isPremium?: boolean
          published?: boolean
          reads?: number
          slug: string
          tags?: string[] | null
          thumbnail: string
          title: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          categoryName?: string | null
          createdAt?: string
          description?: string
          id?: string
          isDeleted?: boolean
          isMature?: boolean
          isPremium?: boolean
          published?: boolean
          reads?: number
          slug?: string
          tags?: string[] | null
          thumbnail?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_categoryName_fkey"
            columns: ["categoryName"]
            isOneToOne: false
            referencedRelation: "genre"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
