export type ReelStatus = "pending" | "approved" | "published" | "rejected";

export type Reel = {
  id: string;
  instagram_id: string;
  permalink: string;
  media_type: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  caption_original: string | null;
  posted_at: string | null;
  slug: string | null;
  title_es: string | null;
  body_es: string | null;
  title_en: string | null;
  body_en: string | null;
  status: ReelStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  slug: string;
  title: string;
  body: string;
  cover_image_url: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      reels: {
        Row: Reel;
        Insert: Partial<Reel> & {
          instagram_id: string;
          permalink: string;
        };
        Update: Partial<Reel>;
        Relationships: [];
      };
      articles: {
        Row: Article;
        Insert: Partial<Article> & {
          slug: string;
          title: string;
          body: string;
        };
        Update: Partial<Article>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
