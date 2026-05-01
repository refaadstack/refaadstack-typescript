export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          name: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          name?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          short_description: string | null;
          full_description: string | null;
          problem: string | null;
          solution: string | null;
          impact_result: string | null;
          tech_stack: string[] | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: string;
          short_description?: string | null;
          full_description?: string | null;
          problem?: string | null;
          solution?: string | null;
          impact_result?: string | null;
          tech_stack?: string[] | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          short_description?: string | null;
          full_description?: string | null;
          problem?: string | null;
          solution?: string | null;
          impact_result?: string | null;
          tech_stack?: string[] | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_images: {
        Row: {
          id: string;
          portfolio_id: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          image_url?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          tagline: string | null;
          description: string | null;
          features: string[] | null;
          price: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tagline?: string | null;
          description?: string | null;
          features?: string[] | null;
          price?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string | null;
          description?: string | null;
          features?: string[] | null;
          price?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          company_name: string | null;
          testimonial: string;
          avatar_url: string | null;
          rating: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          company_name?: string | null;
          testimonial: string;
          avatar_url?: string | null;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          company_name?: string | null;
          testimonial?: string;
          avatar_url?: string | null;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Enums: {};
  };
}

export type Tables<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | string,
  TableName extends PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions]['Row']
    : never = never
> = TableName;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'],
  EnumName extends PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never = never
> = EnumName;
