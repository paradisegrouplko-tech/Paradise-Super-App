
import React from 'react';
import { 
  Network, Users, UserPlus, ShieldCheck, Wallet, Trophy, 
  ShoppingBag, ShoppingCart, Shirt, Smartphone, Home, Coffee, Gift,
  Plane, Train, Bus, Car, Building2, HardHat, FileCheck, Landmark,
  Banknote, CreditCard, TrendingUp, Zap, Droplet, Flame, Wifi,
  Stethoscope, Pill, Activity, GraduationCap, Award, Globe, PenTool,
  Wrench, Hammer, Gamepad, Music, Headphones, LifeBuoy, HelpCircle,
  MessageSquare, Info, FileText, Scale, Megaphone, Newspaper, QrCode
} from 'lucide-react';

interface SectionIconProps {
  name: string;
  category: string;
  size?: number;
  className?: string;
}

export const SectionIcon: React.FC<SectionIconProps> = ({ name, category, size = 24, className = "" }) => {
  // Core Business
  if (name.includes("Network")) return <Network size={size} className={className} />;
  if (name.includes("Referral")) return <UserPlus size={size} className={className} />;
  if (name.includes("Team")) return <Users size={size} className={className} />;
  if (name.includes("ID")) return <ShieldCheck size={size} className={className} />;
  if (name.includes("Sponsor")) return <ShieldCheck size={size} className={className} />;
  if (name.includes("Earnings")) return <Banknote size={size} className={className} />;
  if (name.includes("Wallet")) return <Wallet size={size} className={className} />;
  if (name.includes("Ranks")) return <Trophy size={size} className={className} />;

  // Finance
  if (name.includes("UPI")) return <QrCode size={size} className={className} />;
  if (name.includes("Loan")) return <Landmark size={size} className={className} />;
  if (name.includes("Insurance")) return <ShieldCheck size={size} className={className} />;
  if (name.includes("Credit")) return <CreditCard size={size} className={className} />;
  if (name.includes("Invest")) return <TrendingUp size={size} className={className} />;
  if (name.includes("Gold")) return <Trophy size={size} className={className} />;

  // Commerce
  if (name.includes("Mega Shopping")) return <ShoppingBag size={size} className={className} />;
  if (name.includes("Grocery")) return <ShoppingCart size={size} className={className} />;
  if (name.includes("Fashion")) return <Shirt size={size} className={className} />;
  if (name.includes("Electronics")) return <Smartphone size={size} className={className} />;
  if (name.includes("Kitchen")) return <Home size={size} className={className} />;
  if (name.includes("Food")) return <Coffee size={size} className={className} />;
  if (name.includes("Gifting")) return <Gift size={size} className={className} />;

  // Travel
  if (name.includes("Flight")) return <Plane size={size} className={className} />;
  if (name.includes("Train")) return <Train size={size} className={className} />;
  if (name.includes("Bus")) return <Bus size={size} className={className} />;
  if (name.includes("Hotel")) return <Building2 size={size} className={className} />;
  if (name.includes("Taxi")) return <Car size={size} className={className} />;

  // Real Estate
  if (name.includes("Real Estate")) return <Building2 size={size} className={className} />;
  if (name.includes("Project")) return <HardHat size={size} className={className} />;
  if (name.includes("Property")) return <FileCheck size={size} className={className} />;

  // Bills
  if (name.includes("Electricity")) return <Zap size={size} className={className} />;
  if (name.includes("Water")) return <Droplet size={size} className={className} />;
  if (name.includes("Gas")) return <Flame size={size} className={className} />;
  if (name.includes("Broadband")) return <Wifi size={size} className={className} />;

  // Health
  if (name.includes("Doctor")) return <Stethoscope size={size} className={className} />;
  if (name.includes("Pharmacy")) return <Pill size={size} className={className} />;
  if (name.includes("Lab")) return <Activity size={size} className={className} />;
  if (name.includes("Fitness")) return <Activity size={size} className={className} />;

  // Education
  if (name.includes("Course")) return <GraduationCap size={size} className={className} />;
  if (name.includes("Skill")) return <Award size={size} className={className} />;
  if (name.includes("Training")) return <Users size={size} className={className} />;
  if (name.includes("Academy")) return <Landmark size={size} className={className} />;
  if (name.includes("Certifi")) return <FileCheck size={size} className={className} />;

  // Digital
  if (name.includes("Website")) return <Globe size={size} className={className} />;
  if (name.includes("Logo")) return <PenTool size={size} className={className} />;
  if (name.includes("Resume")) return <FileText size={size} className={className} />;
  if (name.includes("Social")) return <MessageSquare size={size} className={className} />;

  // Home Services
  if (name.includes("Cleaning")) return <Home size={size} className={className} />;
  if (name.includes("AC")) return <Zap size={size} className={className} />;
  if (name.includes("Electrician")) return <Zap size={size} className={className} />;
  if (name.includes("Plumber")) return <Wrench size={size} className={className} />;
  if (name.includes("Painter")) return <Hammer size={size} className={className} />;

  // Entertainment
  if (name.includes("Game")) return <Gamepad size={size} className={className} />;
  if (name.includes("Music")) return <Music size={size} className={className} />;
  if (name.includes("OTT")) return <Headphones size={size} className={className} />;

  // Support
  if (name.includes("Support")) return <LifeBuoy size={size} className={className} />;
  if (name.includes("Help")) return <HelpCircle size={size} className={className} />;
  if (name.includes("FAQ")) return <HelpCircle size={size} className={className} />;
  if (name.includes("Complaint")) return <MessageSquare size={size} className={className} />;
  if (name.includes("Feedback")) return <MessageSquare size={size} className={className} />;

  // Info
  if (name.includes("About")) return <Info size={size} className={className} />;
  if (name.includes("Polic")) return <FileText size={size} className={className} />;
  if (name.includes("Legal")) return <Scale size={size} className={className} />;
  if (name.includes("Announce")) return <Megaphone size={size} className={className} />;
  if (name.includes("News")) return <Newspaper size={size} className={className} />;

  // Default
  return <Award size={size} className={className} />;
};
