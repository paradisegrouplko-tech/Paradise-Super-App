import { User, PendingRegistration, MemberCRMData, RecentServiceItem, AuditLog, RegistrationStage } from '../types';
import { ROOT_ADMIN_ID, ROOT_ADMIN_PHONE, MAX_DIRECT_MEMBERS, ADMIN_ID, ADMIN_PASSWORD } from '../constants';

const DB_KEYS = {
  USERS: 'paradise_db_users_v3', 
  AUDIT_LOGS: 'paradise_db_audit_logs_v1',
  SESSION: 'paradise_db_session_v2',
  PENDING_REGS: 'paradise_db_pending_regs_v2',
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

// --- SERVICES MOVED UP TO FIX HOISTING ---

export const SessionService = {
  create: (user: User) => {
    if (user.account_status !== 'active') {
       throw new Error("Account is not active.");
    }
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
    localStorage.setItem('paradise_last_user_phone', user.mobile_number);
  },
  get: (): User | null => {
    try {
      const session = localStorage.getItem(DB_KEYS.SESSION);
      if (!session) return null;
      const user = JSON.parse(session);
      // Always re-verify against DB
      const dbUser = _readUsers().find(u => u.user_id === user.user_id);
      if (!dbUser || dbUser.account_status !== 'active') {
        SessionService.clear();
        return null;
      }
      return dbUser;
    } catch { return null; }
  },
  clear: () => localStorage.removeItem(DB_KEYS.SESSION),
  getLastPhone: () => localStorage.getItem('paradise_last_user_phone')
};

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
    const pendingRegs = _readPendingRegs();
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
    _writePendingRegs(filtered);
    alert(`[SIMULATION] Your Mobile OTP is: ${otp}`);
    return { success: true, message: "OTP sent to mobile." };
  },

  verifyMobileOTP: async (mobileNumber: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const pendingRegs = _readPendingRegs();
    const reg = pendingRegs.find(p => p.mobileNumber === mobileNumber);
    if (!reg || reg.otp !== otp) return { success: false, message: "Invalid OTP." };
    if (Date.now() > reg.expiresAt) return { success: false, message: "OTP expired." };
    reg.stage = RegistrationStage.SPONSOR_ENTRY;
    _writePendingRegs(pendingRegs);
    return { success: true, message: "Mobile Verified." };
  },

  validateSponsorAndTriggerOTP: async (mobileNumber: string, sponsorCode: string): Promise<{ success: boolean; message: string; sponsorName?: string }> => {
    const users = _readUsers();
    const sponsor = users.find(u => u.sponsor_code === sponsorCode && u.account_status === 'active');
    if (!sponsor) return { success: false, message: "Invalid or inactive Sponsor ID." };
    if (sponsor.direct_members.length >= MAX_DIRECT_MEMBERS) return { success: false, message: "Sponsor limit reached." };

    const pendingRegs = _readPendingRegs();
    const regIndex = pendingRegs.findIndex(p => p.mobileNumber === mobileNumber);
    if (regIndex === -1) return { success: false, message: "Session expired." };

    const sponsorOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegs[regIndex].sponsorId = sponsor.user_id;
    pendingRegs[regIndex].sponsorOtp = sponsorOtp;
    pendingRegs[regIndex].stage = RegistrationStage.SPONSOR_OTP;
    _writePendingRegs(pendingRegs);
    alert(`[SIMULATION] OTP sent to SPONSOR (${sponsor.name}): ${sponsorOtp}`);
    return { success: true, message: "Sponsor valid. OTP sent.", sponsorName: sponsor.name };
  },

  verifySponsorOTP: async (mobileNumber: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const pendingRegs = _readPendingRegs();
    const reg = pendingRegs.find(p => p.mobileNumber === mobileNumber);
    if (!reg || !reg.sponsorId || reg.sponsorOtp !== otp) return { success: false, message: "Invalid Sponsor OTP." };
    reg.stage = RegistrationStage.FINAL_DETAILS;
    _writePendingRegs(pendingRegs);
    return { success: true, message: "Sponsor Verified." };
  },

  commitUser: async (mobileNumber: string, details: { name: string; occupation: string; subOccupation: string; password: string; emailBase: string }): Promise<{ success: boolean; message: string; user?: User }> => {
    const pendingRegs = _readPendingRegs();
    const reg = pendingRegs.find(p => p.mobileNumber === mobileNumber);
    if (!reg || reg.stage !== RegistrationStage.FINAL_DETAILS || !reg.sponsorId) return { success: false, message: "Invalid session." };

    const users = _readUsers();
    const sponsor = users.find(u => u.user_id === reg.sponsorId);
    if (!sponsor) return { success: false, message: "Sponsor not found." };
    if (sponsor.direct_members.length >= MAX_DIRECT_MEMBERS) {
      reg.stage = RegistrationStage.SPONSOR_ENTRY;
      _writePendingRegs(pendingRegs);
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
      language_preference: 'EN'
    };

    users.push(newUser);
    const sponsorIdx = users.findIndex(u => u.user_id === sponsor.user_id);
    users[sponsorIdx].direct_members.push(newUser.user_id);
    if (!users[sponsorIdx].crm_data) users[sponsorIdx].crm_data = {};
    users[sponsorIdx].crm_data![newUser.user_id] = { status: 'New' };

    _writeUsers(users);
    const remaining = pendingRegs.filter(p => p.mobileNumber !== mobileNumber);
    _writePendingRegs(remaining);
    AuditService.log('SYSTEM', `User Registered: ${userId}`);
    return { success: true, message: "Welcome!", user: newUser };
  }
};

// --- Public API: Database ---

export const db = {
  users: {
    getAll: async (): Promise<User[]> => _readUsers(),
    findById: async (id: string): Promise<User | undefined> => _readUsers().find(u => u.user_id.toUpperCase() === id.toUpperCase()),
    findByMobile: async (mobile: string): Promise<User | undefined> => _readUsers().find(u => u.mobile_number === mobile),
    create: async (userData: User): Promise<{ success: boolean; message: string; user?: User }> => {
       // Keep legacy logic here or deprecate
       const users = _readUsers();
       users.push(userData);
       _writeUsers(users);
       return { success: true, message: "User created", user: userData };
    },
    update: async (id: string, updates: Partial<User>): Promise<boolean> => {
      const users = _readUsers();
      const idx = users.findIndex(u => u.user_id === id);
      if (idx === -1) return false;
      users[idx] = { ...users[idx], ...updates };
      _writeUsers(users);
      const session = SessionService.get();
      if (session && session.user_id === id) localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(users[idx]));
      return true;
    }
  }
};

// --- Helper Functions ---

const _readPendingRegs = (): PendingRegistration[] => {
  try { return JSON.parse(localStorage.getItem(DB_KEYS.PENDING_REGS) || '[]'); } catch { return []; }
};

const _writePendingRegs = (regs: PendingRegistration[]) => {
  localStorage.setItem(DB_KEYS.PENDING_REGS, JSON.stringify(regs));
};

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
       if (!service.isPinned && user.recently_used.filter(s => s.isPinned).length >= 4) return { success: false, message: "Max 4" };
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