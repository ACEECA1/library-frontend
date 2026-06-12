import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let clientRequestCount = 0;
let clientRateLimitReset = Date.now() + 60000;

api.interceptors.request.use(
  (config) => {
    if (Date.now() > clientRateLimitReset) {
      clientRequestCount = 0;
      clientRateLimitReset = Date.now() + 60000;
    }
    if (clientRequestCount >= 90) {
      return Promise.reject(new Error("Client-side rate limit exceeded. Please slow down."));
    }
    clientRequestCount++;

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const originalGet = api.get;
const cache = new Map<string, { data: any, timestamp: number }>();

api.get = async function (url: string, config?: any) {
  const key = url + JSON.stringify(config?.params || {});
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return Promise.resolve(cached.data);
  }
  const response = await originalGet.call(api, url, config);
  cache.set(key, { data: response, timestamp: Date.now() });
  return response;
} as any;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('permissions');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('permissions');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
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
  getArchivedBooks: () => api.get<ApiResponse<PaginatedData<BookResponseDTO>>>('/books/archived'),
  getMyUploads: (params?: any) => api.get<ApiResponse<PaginatedData<BookResponseDTO>>>('/books/my-uploads', { params }),
  approveBook: (id: string | number) => api.post(`/books/${id}/approve`),
  restoreBook: (id: string | number) => api.post(`/books/${id}/restore`),
  getBookContent: (id: string | number) => api.get(`/books/${id}/content`),
  getBookStream: (id: string | number) => api.get(`/books/${id}/stream`, { responseType: 'blob' }),
  getProgress: (id: string | number) => api.get(`/books/${id}/progress`),
  updateProgress: (id: string | number, page: number) => api.post(`/books/${id}/progress?page=${page}`),
  uploadBook: (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  }),
  updateBook: (id: string | number, data: any) => api.put<ApiResponse<BookResponseDTO>>(`/books/${id}`, data),
  deleteBook: (id: string | number) => api.delete<ApiResponse<void>>(`/books/${id}`)
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
  getBookmarks: () => api.get<ApiResponse<PaginatedData<any>>>('/bookmarks'),
  addBookmark: (bookId: number | string, note?: string) => api.post<ApiResponse<any>>('/bookmarks', { bookId, note }),
  deleteBookmark: (id: number | string) => api.delete<ApiResponse<any>>(`/bookmarks/${id}`)
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
  getUsers: (params?: any) => api.get<ApiResponse<PaginatedData<UserDTO>>>('/admin/users', { params }),
  getRoles: (params?: any) => api.get<ApiResponse<PaginatedData<RoleDTO>>>('/admin/roles', { params }),
  getPermissions: () => api.get<ApiResponse<any[]>>('/admin/roles/permissions'),
  approveUser: (id: string | number) => api.post(`/admin/users/${id}/approve`),
  approveBulkUsers: (ids: (string | number)[]) => api.post('/admin/users/approve-bulk', ids),
  banUser: (id: string | number, reason: string) => api.post(`/admin/users/${id}/ban`, { reason }),
  timeoutUser: (id: string | number, minutes: number, reason: string) => api.post(`/admin/users/${id}/timeout`, { minutes, reason }),
  addRole: (data: any) => api.post<ApiResponse<RoleDTO>>('/admin/roles', data),
  getAuditLogs: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/admin/audit-logs', { params })
};

export const reportApi = {
  submitReport: (targetType: string, targetId: number | string, reason: string) => api.post('/reports', { targetType, targetId, reason }),
  getReports: (resolved: boolean, params?: any) => api.get('/reports', { params: { resolved, ...params } }),
  resolveReport: (id: number | string) => api.post(`/reports/${id}/resolve`)
};

export const notificationApi = {
  getNotifications: () => api.get<ApiResponse<any[]>>('/notifications')
};
