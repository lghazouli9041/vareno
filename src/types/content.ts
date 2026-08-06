export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: "Residential" | "Hospitality" | "Commercial";
  excerpt: string;
  description: string;
  coverImage: string;
  gallery: string[];
  productsUsed: string[];
  designer?: string;
  year: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
}
