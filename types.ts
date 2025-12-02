export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  sponsorId: string | null;
  sponsorCode: string;
  occupationCategory: string;
  occupationSubCategory: string;
  joinedAt: string;
  password?: string;
  directMembers: string[];
  biometricEnabled?: boolean;
  upiId?: string;
  isBlocked?: boolean;
  crmData?: Record<string, MemberCRMData>; 
  recentlyUsed?: RecentServiceItem[];
  plan?: 'Basic' | 'Plus' | 'Premium';
  mobileNumber?: string; 
  paradiseEmail?: string;
  occupation_main?: string;
  accountStatus?: 'active' | 'pending' | 'blocked';
  adsEnabled?: boolean;
  languagePreference?: 'EN' | 'HI';
  
  // Internal Mapped Fields for DB Consistency (v3 schema)
  user_id: string;
  mobile_number: string;
  sponsor_upline_id: string | null;
  sponsor_code: string;
  paradise_email: string;
  // ... other mapped fields
}

// ... [Existing Interfaces remain same] ...

// --- NEW: Commission Engine Types ---

export type IndustryType = 'REAL_ESTATE' | 'PROFESSIONAL_SERVICES' | 'DIGITAL_GOODS' | 'GENERAL_COMMERCE' | 'DEFAULT';

export interface CommissionRule {
  rule_id: string;
  industry_name: IndustryType;
  project_name?: string | null; // Optional override
  
  // Percentages (0.00 to 1.00)
  seller_cut_pct: number;
  paradise_cut_pct: number;
  upline_L1_pct: number;
  upline_L2_pct: number;
  upline_L3_pct: number;
  upline_L4_pct: number;
}

export interface PayoutDistribution {
  seller: { id: string; amount: number };
  paradise: { amount: number };
  uplines: {
    L1?: { id: string; amount: number };
    L2?: { id: string; amount: number };
    L3?: { id: string; amount: number };
    L4?: { id: string; amount: number };
  };
  total_distributed: number;
}

export interface TransactionLedger {
  transaction_id: string;
  seller_user_id: string;
  gross_value: number;
  industry: IndustryType;
  payout_snapshot: PayoutDistribution; // Immutable Snapshot
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  payout_triggered_at?: string;
}

// ... [Rest of types] ...
export interface RecentServiceItem {
  id: string;
  name: string;
  category: string;
  isPinned: boolean;
  lastUsed: number;
}

export type MemberStatus = 'New' | 'Active' | 'Needs Training' | 'Not Responding' | 'Prospect for Real Estate';

export interface MemberCRMData {
  lastContactDate?: string;
  nextFollowUpDate?: string;
  notes?: string;
  status: MemberStatus;
}

export interface PendingRegistration {
  tempId: string;
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
  subCategories: string[];
  groups?: OccupationGroup[];
}

export enum AppRoute {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  LAUNCHER = 'LAUNCHER',
  SECTION_DETAIL = 'SECTION_DETAIL',
  PROFILE = 'PROFILE',
  UPI_CENTER = 'UPI_CENTER',
  VIDEO_HUB = 'VIDEO_HUB',
  CHAT_HUB = 'CHAT_HUB',
  AI_HUB = 'AI_HUB',
  MARKETPLACE = 'MARKETPLACE',
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  SITE_VISIT_BOOKING = 'SITE_VISIT_BOOKING',
  ALL_REAL_ESTATE = 'ALL_REAL_ESTATE',
  CRM_DASHBOARD = 'CRM_DASHBOARD',
  CRM_MEMBER_DETAIL = 'CRM_MEMBER_DETAIL',
  PREMIUM_ACCESS = 'PREMIUM_ACCESS',
  REFER_AND_EARN = 'REFER_AND_EARN',
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
  groups?: ServiceGroup[];
}

export interface ServiceGroup {
  title: string;
  items: string[];
}

export interface AppCategory {
  title: string;
  items: AppSectionItem[];
}

export enum RegistrationStage {
  MOBILE_OTP = 'MOBILE_OTP',
  SPONSOR_ENTRY = 'SPONSOR_ENTRY',
  SPONSOR_OTP = 'SPONSOR_OTP',
  FINAL_DETAILS = 'FINAL_DETAILS'
}

export interface AuditLog {
  log_id: string;
  timestamp: string;
  admin_user_id: string | null;
  action_description: string;
  target_user_id?: string;
}