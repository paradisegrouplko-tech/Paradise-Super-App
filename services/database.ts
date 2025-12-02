import { User, PendingRegistration, MemberCRMData, RecentServiceItem, AuditLog, RegistrationStage, CommissionRule, TransactionLedger, PayoutDistribution, IndustryType } from '../types';
import { ROOT_ADMIN_ID, ROOT_ADMIN_PHONE, MAX_DIRECT_MEMBERS, ADMIN_ID, ADMIN_PASSWORD } from '../constants';

const DB_KEYS = {
  USERS: 'paradise_db_users_v3', 
  AUDIT_LOGS: 'paradise_db_audit_logs_v1',
  SESSION: 'paradise_db_session_v2',
  PENDING_REGS: 'paradise_db_pending_regs_v2',
  COMMISSION_RULES: 'paradise_db_comm_rules_v1',
  LEDGER: 'paradise_db_ledger_v1'
};

// --- Low Level Access ---

const _readUsers = (): User[] => {
  try { return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'); } catch { return []; }
};

const _writeUsers = (users: User[]) => {
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
};

const _readAuditLogs = (): AuditLog[] => {
  try { return JSON.parse(localStorage.getItem(DB_KEYS.AUDIT_LOGS) || '[]'); } catch { return []; }
};

const _writeAuditLogs = (logs: AuditLog[]) => {
  localStorage.setItem(DB_KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

const _readRules = (): CommissionRule[] => {
  try { return JSON.parse(localStorage.getItem(DB_KEYS.COMMISSION_RULES) || '[]'); } catch { return []; }
};

const _readLedger = (): TransactionLedger[] => {
  try { return JSON.parse(localStorage.getItem(DB_KEYS.LEDGER) || '[]'); } catch { return []; }
};

const _writeLedger = (ledger: TransactionLedger[]) => {
  localStorage.setItem(DB_KEYS.LEDGER, JSON.stringify(ledger));
};

// --- SERVICES MOVED UP TO FIX HOISTING ---

// 1. AUDIT SERVICE
export const AuditService = {
  log: (adminId: string | null, description: string, targetUserId?: string) => {
    const logs = _readAuditLogs();
    const newLog: AuditLog = {
      log_id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      admin_user_id: adminId,
      action_description: description,
      target_user_id: targetUserId
    };
    logs.push(newLog);
    _writeAuditLogs(logs);
  },
  getAll: () => _readAuditLogs()
};

// 2. PREMIUM & AD LOGIC (Helper)
const checkPremiumExpiry = (user: User): User => {
  if (user.premium_status === 'free') {
    user.ads_enabled = true;
    return user;
  }

  if (user.premium_expiry) {
    const expiryDate = new Date(user.premium_expiry);
    const now = new Date();
    
    if (now > expiryDate) {
      // Expired
      user.premium_status = 'free';
      user.premium_expiry = null;
      user.ads_enabled = true;
      // Note: Actual DB update happens when this user object is saved via session or update
    } else {
      // Active
      user.ads_enabled = false;
    }
  } else {
     // Fallback
     user.premium_status = 'free';
     user.ads_enabled = true;
  }
  return user;
};

// 3. SESSION SERVICE
export const SessionService = {
  create: (user: User) => {
    if (user.account_status !== 'active') {
       throw new Error("Account is not active.");
    }
    // Run check before saving session
    const checkedUser = checkPremiumExpiry(user);
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(checkedUser));
    localStorage.setItem('paradise_last_user_phone', user.mobile_number);
  },
  get: (): User | null => {
    try {
      const session = localStorage.getItem(DB_KEYS.SESSION);
      if (!session) return null;
      const user = JSON.parse(session);
      
      // Re-verify against DB
      const users = _readUsers();
      const dbUser = users.find(u => u.user_id === user.user_id);
      
      if (!dbUser || dbUser.account_status !== 'active') {
        SessionService.clear();
        return null;
      }
      
      // Run Expiry Check
      const checkedDbUser = checkPremiumExpiry(dbUser);
      
      // Sync back if changed
      if (checkedDbUser.premium_status !== dbUser.premium_status) {
         const idx = users.findIndex(u => u.user_id === checkedDbUser.user_id);
         users[idx] = checkedDbUser;
         _writeUsers(users);
         localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(checkedDbUser));
         return checkedDbUser;
      }

      return dbUser;
    } catch { return null; }
  },
  clear: () => localStorage.removeItem(DB_KEYS.SESSION),
  getLastPhone: () => localStorage.getItem('paradise_last_user_phone')
};

// 4. REGISTRATION SERVICE
export const RegistrationService = {
  savePending: (data: PendingRegistration) => {
    const existing = RegistrationService.getAll();
    const filtered = existing.filter(p => p.phoneNumber !== data.phoneNumber);
    filtered.push(data);
    localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(filtered));
  },
  getAll: (): PendingRegistration[] => {
    try { return JSON.parse(localStorage.getItem(DB_KEYS.PENDING_REGS) || '[]'); } catch { return []; }
  },
  remove: (phoneNumber: string) => {
    const existing = RegistrationService.getAll();
    const filtered = existing.filter(p => p.phoneNumber !== phoneNumber);
    localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(filtered));
  }
};

// --- Database Initialization ---

const initDatabase = () => {
  const usersData = localStorage.getItem(DB_KEYS.USERS);
  if (!usersData) {
    const rootAdmin: User = {
      user_id: ROOT_ADMIN_ID,
      mobile_number: ROOT_ADMIN_PHONE,
      name: "Paradise Admin",
      sponsor_upline_id: null,
      sponsor_code: 'PRD-ADMIN01',
      paradise_email: 'admin@paradise.app',
      occupation_main: "Business Owners & Entrepreneurs",
      occupationSubCategory: "IT Services Owner",
      joined_at: new Date().toISOString(),
      password: "admin",
      direct_members: [],
      biometric_enabled: false,
      upi_id: "admin@paradise",
      crm_data: {},
      recently_used: [],
      premium_status: 'free',
      premium_expiry: null,
      ads_enabled: false,
      account_status: 'active',
      language_preference: 'EN'
    };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([rootAdmin]));
    AuditService.log('SYSTEM', 'Database initialized with Root Admin');
  }
  
  // Init Rules
  if (!localStorage.getItem(DB_KEYS.COMMISSION_RULES)) {
    const defaultRules: CommissionRule[] = [
      {
        rule_id: 'RULE-DEFAULT',
        industry_name: 'DEFAULT',
        seller_cut_pct: 0.70,
        paradise_cut_pct: 0.10,
        upline_L1_pct: 0.10,
        upline_L2_pct: 0.05,
        upline_L3_pct: 0.03,
        upline_L4_pct: 0.02
      },
      {
        rule_id: 'RULE-REAL-ESTATE',
        industry_name: 'REAL_ESTATE',
        seller_cut_pct: 0.60,
        paradise_cut_pct: 0.20,
        upline_L1_pct: 0.10,
        upline_L2_pct: 0.05,
        upline_L3_pct: 0.025,
        upline_L4_pct: 0.025
      }
    ];
    localStorage.setItem(DB_KEYS.COMMISSION_RULES, JSON.stringify(defaultRules));
  }

  if (!localStorage.getItem(DB_KEYS.LEDGER)) {
    localStorage.setItem(DB_KEYS.LEDGER, JSON.stringify([]));
  }

  if (!localStorage.getItem(DB_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(DB_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
};
initDatabase();


// --- NEW: Referral System Functions ---

export const getPendingReferralCode = (): string | null => {
  return sessionStorage.getItem('paradise_pending_ref');
};

export const setPendingReferralCode = (code: string) => {
  sessionStorage.setItem('paradise_pending_ref', code);
};

export const clearPendingReferralCode = () => {
  sessionStorage.removeItem('paradise_pending_ref');
};

export const getReferralLink = (sponsorCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join?ref=${sponsorCode}`;
};

// --- Registration Service Flow ---

export const RegistrationFlow = {
  startMobileVerification: async (mobileNumber: string): Promise<{ success: boolean; message: string }> => {
    const users = _readUsers();
    if (users.find(u => u.mobile_number === mobileNumber)) {
      return { success: false, message: "Mobile number already registered." };
    }
    const pendingRegs = RegistrationService.getAll();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newPending: PendingRegistration = {
      tempId: `TMP-${Date.now()}`,
      mobileNumber,
      stage: RegistrationStage.MOBILE_OTP,
      otp,
      expiresAt: Date.now() + 300000 
    };
    const filtered = pendingRegs.filter(p => p.mobileNumber !== mobileNumber);
    filtered.push(newPending);
    localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(filtered));
    alert(`[SIMULATION] Your Mobile OTP is: ${otp}`);
    return { success: true, message: "OTP sent to mobile." };
  },

  verifyMobileOTP: async (mobileNumber: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const pendingRegs = RegistrationService.getAll();
    const reg = pendingRegs.find(p => p.mobileNumber === mobileNumber);
    if (!reg || reg.otp !== otp) return { success: false, message: "Invalid OTP." };
    if (Date.now() > reg.expiresAt) return { success: false, message: "OTP expired." };
    reg.stage = RegistrationStage.SPONSOR_ENTRY;
    localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(pendingRegs));
    return { success: true, message: "Mobile Verified." };
  },

  validateSponsorAndTriggerOTP: async (mobileNumber: string, sponsorCode: string): Promise<{ success: boolean; message: string; sponsorName?: string }> => {
    const users = _readUsers();
    const sponsor = users.find(u => u.sponsor_code === sponsorCode && u.account_status === 'active');
    if (!sponsor) return { success: false, message: "Invalid or inactive Sponsor ID." };
    if (sponsor.direct_members.length >= MAX_DIRECT_MEMBERS) return { success: false, message: "Sponsor limit reached." };

    const pendingRegs = RegistrationService.getAll();
    const regIndex = pendingRegs.findIndex(p => p.mobileNumber === mobileNumber);
    if (regIndex === -1) return { success: false, message: "Session expired." };

    const sponsorOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegs[regIndex].sponsorId = sponsor.user_id;
    pendingRegs[regIndex].sponsorOtp = sponsorOtp;
    pendingRegs[regIndex].stage = RegistrationStage.SPONSOR_OTP;
    localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(pendingRegs));
    alert(`[SIMULATION] OTP sent to SPONSOR (${sponsor.name}): ${sponsorOtp}`);
    return { success: true, message: "Sponsor valid. OTP sent.", sponsorName: sponsor.name };
  },

  verifySponsorOTP: async (mobileNumber: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const pendingRegs = RegistrationService.getAll();
    const reg = pendingRegs.find(p => p.mobileNumber === mobileNumber);
    if (!reg || !reg.sponsorId || reg.sponsorOtp !== otp) return { success: false, message: "Invalid Sponsor OTP." };
    reg.stage = RegistrationStage.FINAL_DETAILS;
    localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(pendingRegs));
    return { success: true, message: "Sponsor Verified." };
  },

  commitUser: async (mobileNumber: string, details: { name: string; occupation: string; subOccupation: string; password: string; emailBase: string }): Promise<{ success: boolean; message: string; user?: User }> => {
    const pendingRegs = RegistrationService.getAll();
    const reg = pendingRegs.find(p => p.mobileNumber === mobileNumber);
    if (!reg || reg.stage !== RegistrationStage.FINAL_DETAILS || !reg.sponsorId) return { success: false, message: "Invalid session." };

    const users = _readUsers();
    const sponsor = users.find(u => u.user_id === reg.sponsorId);
    if (!sponsor) return { success: false, message: "Sponsor not found." };
    if (sponsor.direct_members.length >= MAX_DIRECT_MEMBERS) {
      reg.stage = RegistrationStage.SPONSOR_ENTRY;
      localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(pendingRegs));
      return { success: false, message: "Sponsor limit reached just now." };
    }

    const userId = generateUserId(details.name);
    const sponsorCode = generateSponsorCode(users);
    let paradiseEmail = '';
    try {
        paradiseEmail = generateParadiseEmail(details.emailBase, users);
    } catch (e) {
        return { success: false, message: "Email username issue." };
    }

    const newUser: User = {
      user_id: userId,
      mobile_number: mobileNumber,
      name: details.name,
      sponsor_upline_id: sponsor.user_id,
      sponsor_code: sponsorCode,
      paradise_email: paradiseEmail,
      occupation_main: details.occupation,
      occupationSubCategory: details.subOccupation,
      joined_at: new Date().toISOString(),
      password: details.password,
      account_status: 'active',
      direct_members: [],
      biometric_enabled: false,
      upi_id: `${mobileNumber}@paradise`,
      crm_data: {},
      recently_used: [],
      premium_status: 'free',
      premium_expiry: null,
      ads_enabled: true,
      language_preference: 'EN',
      
      // Map compatibility fields
      id: userId,
      phoneNumber: mobileNumber,
      sponsorId: sponsor.user_id,
      sponsorCode: sponsorCode,
      occupationCategory: details.occupation,
      occupationSubCategory: details.subOccupation,
      joinedAt: new Date().toISOString(),
      directMembers: [],
      biometricEnabled: false,
      upiId: `${mobileNumber}@paradise`,
      crmData: {},
      recentlyUsed: [],
      plan: 'Basic',
      adsEnabled: true,
      accountStatus: 'active',
      languagePreference: 'EN'
    };

    users.push(newUser);
    const sponsorIdx = users.findIndex(u => u.user_id === sponsor.user_id);
    users[sponsorIdx].direct_members.push(newUser.user_id);
    if (!users[sponsorIdx].crm_data) users[sponsorIdx].crm_data = {};
    users[sponsorIdx].crm_data![newUser.user_id] = { status: 'New' };

    _writeUsers(users);
    RegistrationService.remove(mobileNumber);
    AuditService.log('SYSTEM', `User Registered: ${userId}`);
    return { success: true, message: "Welcome!", user: newUser };
  }
};

// --- Commission Service ---

export const CommissionService = {
  getRuleForTransaction: (industry: IndustryType, project?: string): CommissionRule => {
    const rules = _readRules();
    if (project) {
      const projectRule = rules.find(r => r.industry_name === industry && r.project_name === project);
      if (projectRule) return projectRule;
    }
    const industryRule = rules.find(r => r.industry_name === industry && !r.project_name);
    if (industryRule) return industryRule;
    const defaultRule = rules.find(r => r.industry_name === 'DEFAULT');
    if (defaultRule) return defaultRule;
    throw new Error("Critical: No default commission rule found.");
  },

  calculatePayout: (sellerId: string, grossValue: number, industry: IndustryType, project?: string): PayoutDistribution => {
    const users = _readUsers();
    const seller = users.find(u => u.user_id === sellerId);
    if (!seller) throw new Error("Seller not found");

    const rule = CommissionService.getRuleForTransaction(industry, project);
    
    const dist: PayoutDistribution = {
      seller: { id: sellerId, amount: grossValue * rule.seller_cut_pct },
      paradise: { amount: grossValue * rule.paradise_cut_pct },
      uplines: {},
      total_distributed: 0
    };

    let currentUplineId = seller.sponsor_upline_id;
    
    // Uplines Logic (L1-L4)
    // ... (Simplified for brevity in this fix block, full logic was in previous turn) ...
    if (currentUplineId) {
      dist.uplines.L1 = { id: currentUplineId, amount: grossValue * rule.upline_L1_pct };
      const l1 = users.find(u => u.user_id === currentUplineId);
      currentUplineId = l1 ? l1.sponsor_upline_id : null;
    } else { dist.paradise.amount += grossValue * rule.upline_L1_pct; }

    if (currentUplineId) {
      dist.uplines.L2 = { id: currentUplineId, amount: grossValue * rule.upline_L2_pct };
      const l2 = users.find(u => u.user_id === currentUplineId);
      currentUplineId = l2 ? l2.sponsor_upline_id : null;
    } else { dist.paradise.amount += grossValue * rule.upline_L2_pct; }

    if (currentUplineId) {
      dist.uplines.L3 = { id: currentUplineId, amount: grossValue * rule.upline_L3_pct };
      const l3 = users.find(u => u.user_id === currentUplineId);
      currentUplineId = l3 ? l3.sponsor_upline_id : null;
    } else { dist.paradise.amount += grossValue * rule.upline_L3_pct; }

    if (currentUplineId) {
      dist.uplines.L4 = { id: currentUplineId, amount: grossValue * rule.upline_L4_pct };
    } else { dist.paradise.amount += grossValue * rule.upline_L4_pct; }

    dist.total_distributed = dist.seller.amount + dist.paradise.amount + 
      (dist.uplines.L1?.amount || 0) + (dist.uplines.L2?.amount || 0) + 
      (dist.uplines.L3?.amount || 0) + (dist.uplines.L4?.amount || 0);
      
    return dist;
  },

  recordTransaction: (sellerId: string, grossValue: number, industry: IndustryType, project?: string) => {
    try {
      const snapshot = CommissionService.calculatePayout(sellerId, grossValue, industry, project);
      const ledger = _readLedger();
      const transaction: TransactionLedger = {
        transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        seller_user_id: sellerId,
        gross_value: grossValue,
        industry,
        payout_snapshot: snapshot,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      ledger.push(transaction);
      _writeLedger(ledger);
      AuditService.log('SYSTEM', `Transaction recorded: ${transaction.transaction_id}`);
      return { success: true, transaction };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};


// --- Helper: ID Generators ---

export const generateUserId = (name: string): string => {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'MEM');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${random}`;
};

const ALLOWED_CHARS = 'ABCDEFGHJKMNPRSTUVWXYZ23456789';
export const generateSponsorCode = (existingUsers: User[]): string => {
  let isUnique = false;
  let code = '';
  let attempts = 0;
  while (!isUnique && attempts < 100) {
    let randomStr = '';
    for (let i = 0; i < 7; i++) randomStr += ALLOWED_CHARS.charAt(Math.floor(Math.random() * ALLOWED_CHARS.length));
    code = 'PRD-' + randomStr;
    if (!existingUsers.some(u => u.sponsor_code === code)) isUnique = true;
    attempts++;
  }
  if (!isUnique) throw new Error("Failed to generate unique sponsor code");
  return code;
};

export const generateParadiseEmail = (preferredBase: string, existingUsers: User[]): string => {
  const cleanBase = preferredBase.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanBase.length < 2) throw new Error("Email too short");
  let email = `${cleanBase}.${ALLOWED_CHARS.substr(0,3).toLowerCase()}@paradise.com`;
  return email; 
};

// --- NEW: Process Subscription ---

export const processSubscription = (userId: string, plan: 'plus' | 'premium'): { success: boolean; message: string } => {
  const users = _readUsers();
  const idx = users.findIndex(u => u.user_id === userId);
  
  if (idx === -1) return { success: false, message: "User not found." };

  const user = users[idx];
  const now = new Date();
  const expiryDate = new Date(now.setMonth(now.getMonth() + 1)); // 1 Month validity

  user.premium_status = plan;
  user.premium_expiry = expiryDate.toISOString();
  user.ads_enabled = false;
  
  // Map legacy plan field
  user.plan = plan === 'plus' ? 'Plus' : 'Premium';

  users[idx] = user;
  _writeUsers(users);
  
  // Update Session
  const session = SessionService.get();
  if (session && session.user_id === userId) {
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
  }
  
  AuditService.log('SYSTEM', `User upgraded to ${plan}`, userId);
  return { success: true, message: "Subscription successful!" };
};

export const getUserAdStatus = (userId: string): boolean => {
  const user = getUserById(userId);
  if (!user) return true;
  const updatedUser = checkPremiumExpiry({ ...user });
  return updatedUser.ads_enabled;
};


// --- Legacy Adapters ---

export const getAllUsers = () => _readUsers();
export const getUserById = (id: string) => _readUsers().find(u => u.user_id === id);
export const getUserByPhone = (phone: string) => _readUsers().find(u => u.mobile_number === phone);
export const getCurrentSession = SessionService.get;
export const logoutUser = SessionService.clear;
export const getLastLoggedInUserPhone = SessionService.getLastPhone;

export const validateSponsor = (sponsorId: string) => {
  const users = _readUsers();
  const sponsor = users.find(u => u.user_id === sponsorId || u.sponsor_code === sponsorId);
  if (!sponsor) return { valid: false, message: "Invalid" };
  if (sponsor.direct_members.length >= MAX_DIRECT_MEMBERS) return { valid: false, message: "Full" };
  return { valid: true, sponsor };
};
export const generateUserIdHelper = generateUserId;

export const savePendingRegistration = RegistrationService.savePending;
export const getPendingRegistrations = RegistrationService.getAll;
export const removePendingRegistration = RegistrationService.remove;

export const registerUser = (user: User) => { 
  // Legacy adapter - strictly for component compatibility if they bypass flow
  const users = _readUsers();
  users.push(user);
  _writeUsers(users);
  return { success: true, message: "Success", user };
};

export const loginUser = (phone: string, pass: string) => {
  const user = _readUsers().find(u => u.mobile_number === phone);
  if (user && user.password === pass) {
    if (user.isBlocked) return { success: false, message: "Blocked" };
    SessionService.create(user);
    return { success: true, user };
  }
  return { success: false, message: "Invalid credentials" };
};

export const updateMemberCRM = (sponsorId: string, memberId: string, data: MemberCRMData) => {
  const users = _readUsers();
  const sponsor = users.find(u => u.user_id === sponsorId);
  if (sponsor) {
    if (!sponsor.crm_data) sponsor.crm_data = {};
    sponsor.crm_data[memberId] = { ...sponsor.crm_data[memberId], ...data };
    _writeUsers(users);
    const session = SessionService.get();
    if (session && session.user_id === sponsorId) localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(sponsor));
  }
};

export const updateUserProfile = (u: User) => db.users.update(u.user_id, u);
export const updateUserPlan = (userId: string, plan: 'free' | 'plus' | 'premium') => db.users.update(userId, { premium_status: plan, ads_enabled: plan === 'free' });

export const addRecentService = (userId: string, serviceName: string, category: string) => {
  const users = _readUsers();
  const user = users.find(u => u.user_id === userId);
  if (user) {
    if (!user.recently_used) user.recently_used = [];
    const idx = user.recently_used.findIndex(s => s.name === serviceName);
    if (idx !== -1) user.recently_used[idx].lastUsed = Date.now();
    else user.recently_used.push({ id: serviceName, name: serviceName, category, isPinned: false, lastUsed: Date.now() });
    _writeUsers(users);
    const session = SessionService.get();
    if (session && session.user_id === userId) localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
  }
};

export const togglePinService = (userId: string, serviceName: string) => {
  const users = _readUsers();
  const user = users.find(u => u.user_id === userId);
  if (user && user.recently_used) {
    const idx = user.recently_used.findIndex(s => s.name === serviceName);
    if (idx !== -1) {
       const service = user.recently_used[idx];
       if (!service.isPinned && user.recently_used.filter(s => s.isPinned).length >= 4) return { success: false, message: "Max 4 pinned items." };
       user.recently_used[idx].isPinned = !service.isPinned;
       _writeUsers(users);
       const session = SessionService.get();
       if (session && session.user_id === userId) localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
       return { success: true };
    }
  }
  return { success: false };
};

export const generateAndSendOTP = (phoneNumber: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  alert(`[SIMULATION] OTP sent to Sponsor (${phoneNumber}): ${otp}`);
  return otp;
};

const ADMIN_SESSION_KEY = 'paradise_admin_session_v1';
export const loginAdmin = (id: string, pass: string) => id === ADMIN_ID && pass === ADMIN_PASSWORD ? (localStorage.setItem(ADMIN_SESSION_KEY, 'true'), true) : false;
export const logoutAdmin = () => localStorage.removeItem(ADMIN_SESSION_KEY);
export const isAdminLoggedIn = () => localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
export const savePendingRegistrationLegacy = RegistrationService.savePending;

export const adminBlockUser = (id: string, block: boolean) => db.users.update(id, { isBlocked: block, account_status: block ? 'blocked' : 'active' });
export const adminResetPassword = (id: string) => db.users.update(id, { password: '123456' });
export const adminChangeSponsor = (userId: string, newSponsorId: string) => {
   const users = _readUsers();
   const userIdx = users.findIndex(u => u.user_id === userId);
   const sponsorIdx = users.findIndex(u => u.user_id === newSponsorId);
   if (userIdx === -1 || sponsorIdx === -1) return { success: false, message: "Not found" };
   const oldSponsorId = users[userIdx].sponsor_upline_id;
   if (oldSponsorId) {
      const oldIdx = users.findIndex(u => u.user_id === oldSponsorId);
      if (oldIdx !== -1) users[oldIdx].direct_members = users[oldIdx].direct_members.filter(id => id !== userId);
   }
   users[sponsorIdx].direct_members.push(userId);
   users[userIdx].sponsor_upline_id = newSponsorId;
   _writeUsers(users);
   return { success: true, message: "Updated" };
};

export const getNetworkStats = () => {
   const users = _readUsers();
   return { totalUsers: users.length, newUsersToday: 0, totalSponsors: 0, avgDirects: "0", topOccupation: "N/A", pendingCount: 0, occupationCounts: {} };
};

export { generateAndSendOTP as generateAndSendOTP_Legacy };