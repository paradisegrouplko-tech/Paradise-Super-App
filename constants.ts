
import { OccupationCategory, AppCategory } from './types';

export const MAX_DIRECT_MEMBERS = 15;

// Hardcoded Admin Credentials for Version 1
export const ADMIN_ID = "ADMIN01";
export const ADMIN_PASSWORD = "admin";

export const OCCUPATIONS: OccupationCategory[] = [
  {
    name: "Teachers & Educators",
    subCategories: [
      "School Teacher", "College Professor", "University Lecturer", "Tutor / Coaching Teacher",
      "Principal / Academic Head", "Special Educator", "Early Childhood Educator", "Research Scholar",
      "Education Administrator", "Education Consultant", "Language Trainer", "Vocational Trainer",
      "Sports / Physical Education Coach", "Music / Arts Teacher", "Other Educators"
    ]
  },
  {
    name: "Defense & Uniformed Services",
    subCategories: [
      "Army Personnel", "Navy Personnel", "Air Force Personnel", "Paramilitary Forces", "Police Officer",
      "Traffic Police", "City Security Forces", "Firefighter", "Coast Guard", "Prison & Correctional Services",
      "Border Security Forces", "Intelligence & Investigation Services", "Disaster Response Team",
      "Private Security Officer", "Other Defense / Uniform Services"
    ]
  },
  {
    name: "Business Owners & Entrepreneurs",
    subCategories: [
      "Real Estate Developer", "Contractor / Builder", "Retail Shop Owner", "Wholesale Trader",
      "Manufacturing Business Owner", "Import / Export Business", "E-Commerce Seller", "Restaurant / Café Owner",
      "Hotel / Resort Owner", "Travel Agency Owner", "Transport / Logistics Owner", "Distributor / Stockist",
      "Franchise Owner", "IT Services Owner", "Marketing Agency Owner", "Finance / Loan Consultant",
      "Insurance Agency Owner", "Healthcare Clinic Owner", "Pharmacy Owner", "Automobile Dealership Owner",
      "Agriculture Business Owner", "Construction Material Supplier", "Interior / Architecture Firm Owner",
      "Gym / Fitness Center Owner", "Coaching Institute Owner", "Event Management Owner", "Jewellery Business Owner",
      "Garment Factory Owner", "Beauty Salon / Spa Owner", "Entertainment / Media Company Owner",
      "Printing & Packaging Business", "Consultancy Firm Owner", "Other Business Owners", "Other Entrepreneurs"
    ]
  },
  {
    name: "Workers, Professionals & Skilled Trades",
    subCategories: [
      "Doctor", "Surgeon", "Dentist", "Pharmacist", "Nurse", "Engineer", "Software Engineer", "Chartered Accountant", 
      "Company Secretary", "Lawyer / Advocate", "Architect", "Interior Designer", "Civil Engineer", "Mechanical Engineer", 
      "Electrical Engineer", "Data Scientist", "Pilot", "Scientist / Researcher", "Psychologist", "Accountant", "Banker", 
      "Financial Analyst", "Medical Lab Technician", "HR Professional", "Marketing Professional", "Sales Executive", 
      "Customer Service Executive", "Operations Manager", "Business Analyst", "Graphic Designer", "Video Editor", 
      "Social Media Manager", "Copywriter", "Office Assistant", "Electrician", "Plumber", "Carpenter", "Painter", 
      "Welder", "Machine Operator", "Automobile Mechanic", "AC Technician", "CCTV Technician", "Solar Technician", 
      "Mobile Technician", "Computer Repair Technician", "Construction Worker", "Factory Worker", "Warehouse Worker", 
      "Delivery Personnel", "Driver", "Cleaner", "Security Guard", "Housekeeping Staff", "Farm Worker", "Helper", 
      "Other Professionals", "Other Workers"
    ],
    groups: [
      {
        name: "Highly Prestigious Professionals",
        options: [
          "Doctor", "Surgeon", "Dentist", "Pharmacist", "Nurse", "Engineer", "Software Engineer", 
          "Chartered Accountant", "Company Secretary", "Lawyer / Advocate", "Architect", "Interior Designer", 
          "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Data Scientist", "Pilot", 
          "Scientist / Researcher", "Psychologist", "Accountant", "Banker", "Financial Analyst", "Medical Lab Technician"
        ]
      },
      {
        name: "Corporate & Skilled Office Professionals",
        options: [
          "HR Professional", "Marketing Professional", "Sales Executive", "Customer Service Executive", 
          "Operations Manager", "Business Analyst", "Graphic Designer", "Video Editor", "Social Media Manager", 
          "Copywriter", "Office Assistant"
        ]
      },
      {
        name: "Skilled Technical Workers",
        options: [
          "Electrician", "Plumber", "Carpenter", "Painter", "Welder", "Machine Operator", "Automobile Mechanic", 
          "AC Technician", "CCTV Technician", "Solar Technician", "Mobile Technician", "Computer Repair Technician"
        ]
      },
      {
        name: "Field & Labour Workers",
        options: [
          "Construction Worker", "Factory Worker", "Warehouse Worker", "Delivery Personnel", "Driver", 
          "Cleaner", "Security Guard", "Housekeeping Staff", "Farm Worker", "Helper"
        ]
      },
      {
        name: "General",
        options: [
          "Other Professionals", "Other Workers"
        ]
      }
    ]
  }
];

export const ROOT_ADMIN_ID = "PARADISE001";
export const ROOT_ADMIN_PHONE = "1234567890";

export const APP_SECTIONS: AppCategory[] = [
  {
    title: "Core Business Sections",
    items: [
      { id: 1, name: "Network Builder", isCore: true },
      { id: 2, name: "Referral", isCore: true },
      { id: 3, name: "Team Manager", isCore: true },
      { id: 4, name: "ID Registration", isCore: true },
      { id: 5, name: "Sponsor Approval", isCore: true },
      { id: 6, name: "Earnings (Coming Soon)" },
      { id: 7, name: "Wallet (Coming Soon)" },
      { id: 8, name: "Ranks & Achievements (Coming Soon)" },
    ]
  },
  {
    title: "Commerce & Shopping Sections",
    items: [
      { id: 9, name: "Mega Shopping" },
      { id: 10, name: "Grocery" },
      { id: 11, name: "Fashion" },
      { id: 12, name: "Electronics" },
      { id: 13, name: "Home & Kitchen" },
      { id: 14, name: "Food Delivery" },
      { id: 15, name: "Gifting" },
    ]
  },
  {
    title: "Travel Sections",
    items: [
      { id: 16, name: "Flights" },
      { id: 17, name: "Trains" },
      { id: 18, name: "Bus Booking" },
      { id: 19, name: "Hotel Booking" },
      { id: 20, name: "Taxi & Car Rental" },
    ]
  },
  {
    title: "Real Estate Sections",
    items: [
      { id: 21, name: "Real Estate Marketplace" },
      { id: 22, name: "Project Viewer" },
      { id: 23, name: "Site Visit Booking" },
      { id: 24, name: "Property Verification" },
      { id: 25, name: "Real Estate Commission Plan" },
    ]
  },
  {
    title: "Finance Sections",
    items: [
      { id: 100, name: "UPI Payments", isCore: true },
      { id: 26, name: "Loans & EMI" },
      { id: 27, name: "Insurance" },
      { id: 28, name: "Credit Cards" },
      { id: 29, name: "Investments & SIP" },
      { id: 30, name: "Digital Gold" },
      { id: 31, name: "Finance Offers" },
    ]
  },
  {
    title: "Recharge & Bill Payment Sections",
    items: [
      { id: 32, name: "Mobile Recharge" },
      { id: 33, name: "DTH Recharge" },
      { id: 34, name: "Electricity Bill" },
      { id: 35, name: "Water Bill" },
      { id: 36, name: "Gas Bill" },
      { id: 37, name: "Broadband & WiFi" },
    ]
  },
  {
    title: "Health Sections",
    items: [
      { id: 38, name: "Doctor Consultation" },
      { id: 39, name: "Pharmacy" },
      { id: 40, name: "Lab Tests" },
      { id: 41, name: "Fitness & Wellness" },
    ]
  },
  {
    title: "Education & Training Sections",
    items: [
      { id: 42, name: "Courses" },
      { id: 43, name: "Skill Development" },
      { id: 44, name: "Business Training" },
      { id: 45, name: "Real Estate Academy" },
      { id: 46, name: "Certifications" },
    ]
  },
  {
    title: "Digital Services Sections",
    items: [
      { id: 47, name: "Website Builder" },
      { id: 48, name: "Logo & Branding" },
      { id: 49, name: "Resume Builder" },
      { id: 50, name: "Social Media Services" },
    ]
  },
  {
    title: "Home Services Sections",
    items: [
      { id: 51, name: "Home Cleaning" },
      { id: 52, name: "AC Service" },
      { id: 53, name: "Electrician" },
      { id: 54, name: "Plumber" },
      { id: 55, name: "Painter" },
    ]
  },
  {
    title: "Entertainment Sections",
    items: [
      { id: 56, name: "Games" },
      { id: 57, name: "OTT Subscriptions" },
      { id: 58, name: "Music & Entertainment" },
    ]
  },
  {
    title: "Support Sections",
    items: [
      { id: 59, name: "Customer Support" },
      { id: 60, name: "Tickets & Complaints" },
      { id: 61, name: "Help Center" },
      { id: 62, name: "FAQs" },
      { id: 63, name: "Feedback" },
    ]
  },
  {
    title: "Information Sections",
    items: [
      { id: 64, name: "About Us" },
      { id: 65, name: "Policies" },
      { id: 66, name: "Compliance & Legal" },
      { id: 67, name: "Announcements" },
      { id: 68, name: "News & Updates" },
    ]
  }
];

// --- DUMMY DATA FOR NEW SECTIONS ---

export const DUMMY_VIDEOS = [
  {
    id: 1,
    title: "How to Grow Your Network Fast",
    channel: "Paradise Academy",
    views: "12K views",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Top 10 Investment Tips for 2024",
    channel: "Finance Guru",
    views: "8.5K views",
    thumbnail: "https://images.unsplash.com/photo-1579535984712-a8f7492d240b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "Real Estate Market Trends",
    channel: "Property Insider",
    views: "15K views",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Digital Marketing Masterclass",
    channel: "Tech Skills",
    views: "5K views",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
  },
];

export const DUMMY_CHATS = [
  {
    id: 1,
    name: "Sponsor (John Doe)",
    lastMessage: "Don't forget the meeting at 5 PM.",
    time: "10:30 AM",
    avatar: "S",
    unread: 2
  },
  {
    id: 2,
    name: "Support Team",
    lastMessage: "Your ticket #1234 has been resolved.",
    time: "Yesterday",
    avatar: "T",
    unread: 0
  },
  {
    id: 3,
    name: "Direct Member (Alice)",
    lastMessage: "I just registered a new member!",
    time: "Yesterday",
    avatar: "A",
    unread: 0
  },
  {
    id: 4,
    name: "Network Group",
    lastMessage: "Welcome to all new joiners!",
    time: "2 days ago",
    avatar: "G",
    unread: 5
  },
];
