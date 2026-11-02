export type User = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  locale: string;
  timezone: string;
  roles: string[];
  permissions: string[];
  mfaEnabled: boolean;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'DISCOVERY' | 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'DELIVERED' | 'ARCHIVED';
  startDate?: string;
  endDate?: string;
  budgetCents?: number;
  currency: string;
  repositoryUrl?: string;
  client: User;
  manager?: User;
  progress: number;
  milestoneCount: number;
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Milestone = {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dueDate?: string;
  completedAt?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  projectId: string;
  milestoneId?: string;
  assigneeId?: string;
  reporterId: string;
  title: string;
  description?: string;
  type: 'TASK' | 'BUG' | 'FEATURE' | 'CHORE' | 'RESEARCH';
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  storyPoints?: number;
  dueDate?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  projectId?: string;
  clientId: string;
  slotId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  meetingUrl?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BookingSlot = {
  id: string;
  hostId: string;
  title: string;
  description?: string;
  durationMinutes: number;
  startAt: string;
  endAt: string;
  timezone: string;
  maxBookings: number;
  currentBookings: number;
  isRecurring: boolean;
  recurrenceRule?: string;
  locationType: 'VIDEO' | 'PHONE' | 'IN_PERSON';
  locationDetails?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  clientName?: string;
  clientLogoUrl?: string;
  industry?: string;
  technologies: string[];
  results?: string;
  featuredImage?: string;
  galleryImages: string[];
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  authorId: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  authorId: string;
  categoryId?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  readingTimeMin?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};