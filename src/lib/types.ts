export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedData<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  empty: boolean;
}

export interface UserDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  roles: string[];
  permissions: string[];
  status?: string;
  createdAt?: string;
}

export interface BookResponseDTO {
  id: number;
  title: string;
  author: string;
  description: string;
  thumbnailPath: string;
  status: string;
  views: number;
  averageRating: number;
  reviewCount: number;
  bookmarked: boolean;
  userBookmarkId?: number;
  uploaderUsername: string;
  createdAt: string;
}

export interface CommentDTO {
  id: number;
  text: string;
  userId: number;
  username: string;
  bookId: number;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote: 'UP' | 'DOWN' | null;
}

export interface ReviewDTO {
  id: number;
  text: string;
  rating: number;
  userId: number;
  username: string;
  bookId: number;
  createdAt: string;
}

export interface RoleDTO {
  id: number;
  name: string;
  permissions: any[];
}
