
import { User, PendingRegistration, MemberCRMData } from '../types';
import { ROOT_ADMIN_ID, ROOT_ADMIN_PHONE, MAX_DIRECT_MEMBERS, ADMIN_ID, ADMIN_PASSWORD } from '../constants';

const USERS_KEY = 'paradise_users_v1';
const SESSION_KEY = 'paradise_session_v1';
const LAST_USER_PHONE_KEY = 'paradise_last_user_phone';
const PENDING_REG_KEY = 'paradise_pending_reg_v1';
const ADMIN_SESSION_KEY = 'paradise_admin_session_v1';

// Initialize with a root admin if empty
const initStorage = () => {
  const storedUsers = localStorage.getItem(USERS_KEY);
  if (!storedUsers) {
    const rootAdmin: User = {
      id: ROOT_ADMIN_ID,
      name: "Paradise Admin",
      phoneNumber: ROOT_ADMIN_PHONE,
      sponsorId: null,
      occupationCategory: "Business Owners & Entrepreneurs",
      occupationSubCategory: "IT Services Owner",
      joinedAt: new Date().toISOString(),
      password: "admin",
      directMembers: [],
      biometricEnabled: false,
      upiId: "admin@paradise",
      crmData: {}
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([rootAdmin]));
  }
};

export const getAllUsers = (): User[] => {
  initStorage();
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.id.toUpperCase() === id.toUpperCase());
};

export const getUserByPhone = (phone: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.phoneNumber === phone);
};

export const validateSponsor = (sponsorId: string): { valid: boolean; message?: string; sponsor?: User } => {
  const sponsor = getUserById(sponsorId);
  
  if (!sponsor) {
    return { valid: false, message: "Invalid Sponsor ID. Please check and try again." };
  }

  // Check 15 Direct Members Limit
  if (sponsor.directMembers && sponsor.directMembers.length >= MAX_DIRECT_MEMBERS) {
    return { 
      valid: false, 
      message: "This sponsor already has 15 direct members. Please use another sponsor ID." 
    };
  }

  return { valid: true, sponsor };
};

// Generate a unique Member ID
export const generateUserId = (name: string): string => {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'MEM');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${random}`;
};

// PENDING REGISTRATION LOGIC
export const savePendingRegistration = (data: PendingRegistration) => {
  const existing = getPendingRegistrations();
  // Remove if exists to update
  const filtered = existing.filter(p => p.phoneNumber !== data.phoneNumber);
  filtered.push(data);
  localStorage.setItem(PENDING_REG_KEY, JSON.stringify(filtered));
};

export const getPendingRegistrations = (): PendingRegistration[] => {
  const data = localStorage.getItem(PENDING_REG_KEY);
  return data ? JSON.parse(data) : [];
};

export const removePendingRegistration = (phoneNumber: string) => {
  const existing = getPendingRegistrations();
  const filtered = existing.filter(p => p.phoneNumber !== phoneNumber);
  localStorage.setItem(PENDING_REG_KEY, JSON.stringify(filtered));
};

export const registerUser = (user: User): { success: boolean; message: string; user?: User } => {
  const users = getAllUsers();
  
  // 1. Check Phone uniqueness
  if (users.find(u => u.phoneNumber === user.phoneNumber)) {
    return { success: false, message: "Phone number already registered." };
  }
  
  // 2. Sponsor Logic (Redundant check but safe)
  if (!user.sponsorId) {
    return { success: false, message: "Sponsor ID is missing." };
  }
  
  const sponsorIndex = users.findIndex(u => u.id.toUpperCase() === user.sponsorId?.toUpperCase());
  if (sponsorIndex === -1) {
    return { success: false, message: "Sponsor not found." };
  }

  const sponsor = users[sponsorIndex];

  // 3. Final Limit Check
  if (sponsor.directMembers.length >= MAX_DIRECT_MEMBERS) {
    return { success: false, message: "Sponsor limit reached (15 members)." };
  }

  // 4. Create User
  // Ensure ID is unique
  while (users.find(u => u.id === user.id)) {
    user.id = generateUserId(user.name);
  }
  
  user.directMembers = []; // Initialize empty downline
  user.biometricEnabled = false; // Default off
  user.upiId = `${user.phoneNumber}@paradise`; // Default UPI ID
  user.isBlocked = false;
  user.crmData = {}; // Initialize CRM data

  // 5. Update Structure
  users.push(user);
  
  // Add new user to Sponsor's directMembers list
  sponsor.directMembers.push(user.id);
  
  // Initialize default CRM status for new member under sponsor
  if (!sponsor.crmData) sponsor.crmData = {};
  sponsor.crmData[user.id] = { status: 'New' };

  users[sponsorIndex] = sponsor; // Update sponsor in array

  // 6. Save
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Clean up pending
  removePendingRegistration(user.phoneNumber);

  return { success: true, message: "Registration successful!", user };
};

export const loginUser = (phoneNumber: string, password: string): {success: boolean, user?: User, message?: string} => {
  initStorage();
  const users = getAllUsers();
  const user = users.find(u => u.phoneNumber === phoneNumber && u.password === password);
  
  if (user) {
    if (user.isBlocked) {
      return { success: false, message: "Your account has been blocked by Admin. Contact support." };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    // Save last logged in phone for biometric convenience
    localStorage.setItem(LAST_USER_PHONE_KEY, phoneNumber);
    return { success: true, user };
  }
  return { success: false };
};

// Feature: Biometric Login Simulation
export const getLastLoggedInUserPhone = (): string | null => {
  return localStorage.getItem(LAST_USER_PHONE_KEY);
};

export const updateUserProfile = (updatedUser: User) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update session if it matches
    const currentSession = getCurrentSession();
    if (currentSession && currentSession.id === updatedUser.id) {
       localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    }
  }
};

export const updateMemberCRM = (sponsorId: string, memberId: string, data: MemberCRMData) => {
  const users = getAllUsers();
  const sponsorIndex = users.findIndex(u => u.id === sponsorId);
  
  if (sponsorIndex !== -1) {
    const sponsor = users[sponsorIndex];
    if (!sponsor.crmData) sponsor.crmData = {};
    
    // Merge existing data with new data
    sponsor.crmData[memberId] = { ...sponsor.crmData[memberId], ...data };
    
    users[sponsorIndex] = sponsor;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update session if needed
    const currentSession = getCurrentSession();
    if (currentSession && currentSession.id === sponsorId) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sponsor));
    }
  }
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    const sessionUser = JSON.parse(session);
    // Always fetch fresh data based on ID
    const freshData = getUserById(sessionUser.id);
    if (!freshData || freshData.isBlocked) return null;
    return freshData;
  }
  return null;
};

// Mock OTP Service
export const generateAndSendOTP = (phoneNumber: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  alert(`[SIMULATION] OTP sent to Sponsor (${phoneNumber}): ${otp}`);
  return otp;
};

// --- ADMIN FUNCTIONS ---

export const loginAdmin = (id: string, pass: string): boolean => {
  if (id === ADMIN_ID && pass === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

export const adminBlockUser = (userId: string, block: boolean) => {
  const user = getUserById(userId);
  if (user) {
    user.isBlocked = block;
    updateUserProfile(user);
  }
};

export const adminResetPassword = (userId: string) => {
  const user = getUserById(userId);
  if (user) {
    user.password = "123456"; // Default reset password
    updateUserProfile(user);
    alert(`Password for ${user.name} reset to '123456'`);
  }
};

export const adminChangeSponsor = (userId: string, newSponsorId: string): { success: boolean; message: string } => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  const newSponsorIndex = users.findIndex(u => u.id === newSponsorId);

  if (userIndex === -1) return { success: false, message: "User not found" };
  if (newSponsorIndex === -1) return { success: false, message: "New Sponsor not found" };

  const user = users[userIndex];
  const oldSponsorId = user.sponsorId;
  const newSponsor = users[newSponsorIndex];

  // Validation
  if (userId === newSponsorId) return { success: false, message: "Cannot be own sponsor" };
  if (newSponsor.directMembers.length >= MAX_DIRECT_MEMBERS) return { success: false, message: "New Sponsor is full" };
  if (oldSponsorId === newSponsorId) return { success: false, message: "Already under this sponsor" };

  // Remove from old sponsor
  if (oldSponsorId) {
    const oldSponsorIndex = users.findIndex(u => u.id === oldSponsorId);
    if (oldSponsorIndex !== -1) {
      users[oldSponsorIndex].directMembers = users[oldSponsorIndex].directMembers.filter(id => id !== userId);
    }
  }

  // Add to new sponsor
  users[newSponsorIndex].directMembers.push(userId);
  
  // Update user
  users[userIndex].sponsorId = newSponsorId;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: "Sponsor updated successfully" };
};

export const getNetworkStats = () => {
  const users = getAllUsers();
  const totalUsers = users.length;
  const newUsersToday = users.filter(u => {
    const date = new Date(u.joinedAt);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }).length;

  const sponsors = users.filter(u => u.directMembers.length > 0);
  const totalSponsors = sponsors.length;
  
  // Occupation stats
  const occupationCounts: Record<string, number> = {};
  users.forEach(u => {
    occupationCounts[u.occupationCategory] = (occupationCounts[u.occupationCategory] || 0) + 1;
  });
  
  let topOccupation = "N/A";
  let maxCount = 0;
  Object.entries(occupationCounts).forEach(([occ, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topOccupation = occ;
    }
  });

  const pendingCount = getPendingRegistrations().length;

  const avgDirects = totalSponsors > 0 
    ? (users.reduce((acc, u) => acc + u.directMembers.length, 0) / users.length).toFixed(1)
    : "0";

  return {
    totalUsers,
    newUsersToday,
    totalSponsors,
    avgDirects,
    topOccupation,
    pendingCount,
    occupationCounts
  };
};
