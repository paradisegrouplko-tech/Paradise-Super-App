export interface User {
  id: string; // This acts as the Sponsor ID (Member ID)
  name: string;
  phoneNumber: string;
  sponsorId: string | null;
  occupationCategory: string;
  occupationSubCategory: string;
  joinedAt: string;
  password?: string; // stored plainly for this demo only
  directMembers: string[]; // List of IDs of direct downline members
  biometricEnabled?: boolean; // New feature
  upiId?: string; // New feature
  isBlocked?: boolean; // Admin feature
  // CRM Data: Key is the memberId of the downline member
  crmData?: Record<string, MemberCRMData>;
  // Recently Used Services
  recentlyUsed?: RecentServiceItem[]; 
}

export interface RecentServiceItem {
  id: string; // e.g. "Mobile Recharge"
  name: string;
  category: string; // To know which icon/color to use
  isPinned: boolean;
  lastUsed: number; // Timestamp
}

export type MemberStatus = 'New' | 'Active' | 'Needs Training' | 'Not Responding' | 'Prospect for Real Estate';

export interface MemberCRMData {
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes?: string;
  status: MemberStatus;
}

export interface PendingRegistration {
  tempId: string; // Temporary ID for tracking
  name: string;
  phoneNumber: string;
  password: string;
  sponsorId: string;
  occupationCategory: string;
  occupationSubCategory: string;
  submittedAt: string;
  otp: string;
}

export interface OccupationGroup {
  name: string;
  options: string[];
}

export interface OccupationCategory {
  name: string;
  subCategories: string[]; // Flat list for easy access/validation
  groups?: OccupationGroup[]; // Optional groups for UI rendering (e.g. optgroups)
}

export enum AppRoute {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  LAUNCHER = 'LAUNCHER',
  SECTION_DETAIL = 'SECTION_DETAIL',
  PROFILE = 'PROFILE',
  UPI_CENTER = 'UPI_CENTER',
  
  // New Main Tabs
  VIDEO_HUB = 'VIDEO_HUB',
  CHAT_HUB = 'CHAT_HUB',
  AI_HUB = 'AI_HUB',
  MARKETPLACE = 'MARKETPLACE',
  
  // Dynamic Category Page
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  
  // Real Estate Routes
  SITE_VISIT_BOOKING = 'SITE_VISIT_BOOKING',
  ALL_REAL_ESTATE = 'ALL_REAL_ESTATE',
  
  // CRM Routes
  CRM_DASHBOARD = 'CRM_DASHBOARD',
  CRM_MEMBER_DETAIL = 'CRM_MEMBER_DETAIL',
  
  // Admin Routes
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_USERS = 'ADMIN_USERS',
  ADMIN_USER_DETAIL = 'ADMIN_USER_DETAIL',
  ADMIN_STATS = 'ADMIN_STATS',
  ADMIN_APPROVALS = 'ADMIN_APPROVALS',
}

export interface AppSectionItem {
  id: number;
  name: string;
  isCore?: boolean;
  previewMessage?: string; 
  previewCategories?: string[];
}

export interface ServiceCategoryData {
  id: string;
  title: string;
  iconName: string;
  color: string;
  subCategories: string[];
}

export interface AppCategory {
  title: string;
  items: AppSectionItem[];
}