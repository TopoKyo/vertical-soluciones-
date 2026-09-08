export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  authorId: string;
  authorName: string;
  category: string;
  tags?: string[];
  createdAt: any;
  updatedAt?: any;
  publishedAt?: any;
  likes: number;
  commentsCount: number;
  status: 'Publicada' | 'Borrador' | 'Oculta' | 'Destacada';
  featured?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  authorId?: string;
  createdAt: any;
  updatedAt?: any;
  likes: number;
  parentId?: string | null;
}
