import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('permissions');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
import { ApiResponse, PaginatedData, BookResponseDTO, CommentDTO, ReviewDTO, UserDTO, RoleDTO } from './types';

export const bookApi = {
  getBook: (id: string | number) => api.get<ApiResponse<BookResponseDTO>>(`/books/${id}`),
  getBooks: (params?: any) => api.get<ApiResponse<PaginatedData<BookResponseDTO>>>('/books', { params }),
  searchBooks: (params?: any) => api.get<ApiResponse<PaginatedData<BookResponseDTO>>>('/books/search', { params }),
  getPendingBooks: () => api.get<ApiResponse<PaginatedData<BookResponseDTO>>>('/books/pending'),
  getMyUploads: (params?: any) => api.get<ApiResponse<PaginatedData<BookResponseDTO>>>('/books/my-uploads', { params }),
  approveBook: (id: string | number) => api.post(`/books/${id}/approve`),
  getBookContent: (id: string | number) => api.get(`/books/${id}/content`),
  getBookStream: (id: string | number) => api.get(`/books/${id}/stream`, { responseType: 'blob' }),
  uploadBook: (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  })
};

export const commentApi = {
  getComments: (bookId: string | number, params?: any) => api.get<ApiResponse<PaginatedData<CommentDTO>>>(`/books/${bookId}/comments`, { params }),
  addComment: (bookId: string | number, text: string) => api.post<ApiResponse<CommentDTO>>(`/books/${bookId}/comments`, { text }),
  upvote: (bookId: string | number, commentId: string | number) => api.post(`/books/${bookId}/comments/${commentId}/upvote`),
  downvote: (bookId: string | number, commentId: string | number) => api.post(`/books/${bookId}/comments/${commentId}/downvote`)
};

export const reviewApi = {
  getReviews: (bookId: string | number, params?: any) => api.get<ApiResponse<PaginatedData<ReviewDTO>>>(`/reviews/book/${bookId}`, { params }),
  addReview: (data: { bookId: number; rating: number; text: string }) => api.post<ApiResponse<ReviewDTO>>('/reviews', data)
};

export const authApi = {
  me: () => api.get<ApiResponse<UserDTO>>('/auth/me'),
  login: (data: any) => api.post<ApiResponse<any>>('/auth/login', data),
  register: (data: any) => api.post<ApiResponse<any>>('/auth/register', data),
  updateProfile: (data: any) => api.post<ApiResponse<any>>('/auth/update-profile', data),
  changePassword: (data: any) => api.post<ApiResponse<any>>('/auth/change-password', data)
};

export const bookmarkApi = {
  getBookmarks: () => api.get<ApiResponse<any[]>>('/bookmarks')
};

export const metadataApi = {
  getCategories: () => api.get<ApiResponse<any[]>>('/metadata/categories'),
  getTags: () => api.get<ApiResponse<any[]>>('/metadata/tags'),
  getSeries: () => api.get<ApiResponse<any[]>>('/metadata/series'),
  addCategory: (data: any) => api.post<ApiResponse<any>>('/metadata/categories', data),
  addTag: (data: any) => api.post<ApiResponse<any>>('/metadata/tags', data),
  addSeries: (data: any) => api.post<ApiResponse<any>>('/metadata/series', data)
};

export const adminApi = {
  getPendingUsers: () => api.get<ApiResponse<PaginatedData<UserDTO>>>('/admin/users/pending'),
  getUsers: () => api.get<ApiResponse<PaginatedData<UserDTO>>>('/admin/users'),
  getRoles: (params?: any) => api.get<ApiResponse<PaginatedData<RoleDTO>>>('/admin/roles', { params }),
  getPermissions: () => api.get<ApiResponse<any[]>>('/admin/roles/permissions'),
  approveUser: (id: string | number) => api.post(`/admin/users/${id}/approve`),
  approveBulkUsers: (ids: (string | number)[]) => api.post('/admin/users/approve-bulk', ids),
  addRole: (data: any) => api.post<ApiResponse<RoleDTO>>('/admin/roles', data),
  getAuditLogs: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/admin/audit-logs', { params })
};

export const notificationApi = {
  getNotifications: () => api.get<ApiResponse<any[]>>('/notifications')
};
