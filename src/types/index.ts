export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Portfolio {
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
  images?: PortfolioImage[];
}

export interface PortfolioImage {
  id: string;
  portfolio_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  price: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company_name: string | null;
  testimonial: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
