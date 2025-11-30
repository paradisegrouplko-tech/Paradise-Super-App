import { OccupationCategory, AppCategory, ServiceCategoryData } from './types';

export const MAX_DIRECT_MEMBERS = 15;
export const ADMIN_ID = "ADMIN01";
export const ADMIN_PASSWORD = "admin";
export const ROOT_ADMIN_ID = "PARADISE001";
export const ROOT_ADMIN_PHONE = "1234567890";

export const OCCUPATIONS: OccupationCategory[] = [
  {
    name: "Teachers & Educators",
    subCategories: ["School Teacher", "College Professor", "University Lecturer", "Tutor / Coaching Teacher"]
  },
  {
    name: "Defense & Uniformed Services",
    subCategories: ["Army Personnel", "Navy Personnel", "Air Force Personnel", "Police Officer"]
  },
  {
    name: "Business Owners & Entrepreneurs",
    subCategories: ["Real Estate Developer", "Retail Shop Owner", "Wholesale Trader", "Manufacturing Business Owner"]
  },
  {
    name: "Workers, Professionals & Skilled Trades",
    subCategories: ["Doctor", "Engineer", "Software Engineer", "Electrician", "Plumber", "Driver"],
    groups: [
      { name: "Highly Prestigious Professionals", options: ["Doctor", "Engineer", "Software Engineer"] },
      { name: "Skilled Technical Workers", options: ["Electrician", "Plumber", "Carpenter"] }
    ]
  }
];

export const SERVICE_CATEGORIES: ServiceCategoryData[] = [
  {
    id: "payments",
    title: "Quick Payments & Daily Utilities",
    iconName: "Zap",
    color: "text-blue-600 bg-blue-50",
    subCategories: [
      "Mobile Recharge", "DTH & Fastag", "Electricity Bill", "Water & Gas Bill",
      "Loan EMI", "Credit Card Pay", "Broadband Bill", "Landline Bill",
      "Insurance Premiums", "School Fees", "Tax Payments", "Wallet Top-up"
    ]
  },
  {
    id: "quick_commerce",
    title: "QuickCommerce",
    iconName: "ShoppingBag",
    color: "text-orange-600 bg-orange-50",
    subCategories: [
      "Quick Grocery", "Fruits & Vegetables", "Household Essentials", "Snacks & Beverages",
      "Baby Products", "Stationery", "Kitchen Needs", "Instant Beverages",
      "Ready-to-Eat Food", "Pet Supplies", "Cleaning Supplies", "Home Needs"
    ]
  },
  {
    id: "health",
    title: "Health & Wellness",
    iconName: "Heart",
    color: "text-rose-600 bg-rose-50",
    subCategories: [
      "Quick Pharmacy", "Doctor on Call", "Lab Tests", "Mental Health",
      "Ayurveda", "Homeopathy", "Supplements", "Fitness Store",
      "Women's Health", "Elderly Care", "Emergency Care", "Wellness Plans"
    ]
  },
  {
    id: "travel",
    title: "Travel & Transport",
    iconName: "Plane",
    color: "text-sky-600 bg-sky-50",
    subCategories: [
      "Taxi & Auto", "Bike Rentals", "Car Rentals", "Intercity Cab",
      "Flights", "Trains", "Bus Booking", "Hotels & Stays",
      "Tour Packages", "Airport Transfers", "Driver on Demand", "Local Deals"
    ]
  },
  {
    id: "entertainment",
    title: "Digital Lifestyle & Entertainment",
    iconName: "MonitorPlay",
    color: "text-purple-600 bg-purple-50",
    subCategories: [
      "Games", "Short Videos", "OTT Subscriptions", "Music & Podcasts",
      "Meme Hub", "Live Streams", "Comics & Reading", "Creator Hub",
      "Wallpapers", "Ringtones", "E-books", "Radio"
    ]
  },
  {
    id: "finance",
    title: "Finance & Investing",
    iconName: "TrendingUp",
    color: "text-emerald-600 bg-emerald-50",
    subCategories: [
      "Crypto Trading", "Stock Market", "Mutual Funds", "Digital Gold",
      "SIP Center", "Insurance", "Credit Score", "Instant Loans",
      "Tax Tools", "Investment Calculators", "Budget Tracker"
    ]
  },
  {
    id: "spirituality",
    title: "Spirituality & Astrology",
    iconName: "Sun",
    color: "text-amber-600 bg-amber-50",
    subCategories: [
      "Astrology", "Tarot", "Numerology", "Vastu",
      "Puja Booking", "Kundli Report", "Planetary Remedies", "Gemstone Advice",
      "Panchang", "Horoscope Feed", "Matchmaking", "Ritual Services"
    ]
  },
  {
    id: "learning",
    title: "Learning & Student Hub",
    iconName: "GraduationCap",
    color: "text-indigo-600 bg-indigo-50",
    subCategories: [
      "Online Courses", "Skill Learning", "Competitive Exams", "Doubt Solving",
      "Homework Helper", "Coding for Kids", "Kids Learning Games", "Career Guidance",
      "College Counselling", "Spoken English", "Digital Skills", "Parenting Guides"
    ]
  },
  {
    id: "digital_services",
    title: "Digital Services",
    iconName: "Globe",
    color: "text-cyan-600 bg-cyan-50",
    subCategories: [
      "Logo Design", "Brand Identity Packs", "Social Media Creatives", "Instagram Themes",
      "Business Websites", "E-commerce Websites", "UI/UX Design", "App UI",
      "Social Media Marketing", "Google Ads", "SEO", "Lead Generation",
      "AI Chatbots", "AI Videos", "AI Voiceovers", "AI Workflows",
      "Video Editing", "Content Writing", "Copywriting", "Podcast Editing",
      "GST Registration", "Trademark Filing", "Accounting", "Business Consulting",
      "Social Media Audit", "Growth Strategy", "Creator Monetization", "Bio Writing",
      "Laptop Repair", "Mobile Software Fix", "Data Recovery", "Network Setup",
      "Amazon Seller Setup", "Shopify Store Setup", "Product Listing", "Store Audit",
      "WhatsApp Bots", "CRM Setup", "Sales Funnels", "Zapier Integrations"
    ]
  },
  {
    id: "education_training",
    title: "Education & Training",
    iconName: "BookOpen",
    color: "text-blue-800 bg-blue-100",
    subCategories: [
      "Professional Courses", "Business Development", "Leadership Programs", "Sales Mastery",
      "Public Speaking", "Personality Development", "Digital Marketing Courses", "Graphic Design Training",
      "UI/UX Fundamentals", "Real Estate Training", "Coding Courses", "Masterclasses"
    ]
  },
  {
    id: "home_services",
    title: "Home Services",
    iconName: "Home",
    color: "text-lime-600 bg-lime-50",
    subCategories: [
      "Cleaning Services", "Deep Cleaning", "Bathroom Cleaning", "Kitchen Cleaning",
      "Sanitization", "Carpenter", "Electrician", "Plumber",
      "Painter", "AC Repair", "Washing Machine Repair", "Refrigerator Repair",
      "Pest Control", "Water Tank Cleaning", "Sofa Cleaning", "Home Shifting",
      "Packing & Moving", "Home Renovation", "Interior Design", "Salon at Home", "Men’s Grooming"
    ]
  },
  {
    id: "support",
    title: "Support & Help Center",
    iconName: "HelpCircle",
    color: "text-gray-600 bg-gray-100",
    subCategories: [
      "Customer Support", "Live Chat", "Raise a Ticket", "Refund Status",
      "Order Status", "Complaint Submission", "App Issues", "Tutorials & Guides",
      "FAQ", "Verify Sponsor", "Verify ID", "Contact Us",
      "Terms & Conditions", "Privacy Policy"
    ]
  }
];

export const APP_SECTIONS: AppCategory[] = [
  {
    title: "Core Business Sections",
    items: [
      { id: 1, name: "Network Builder", isCore: true },
      { id: 2, name: "Referral", isCore: true },
      { id: 3, name: "Team Manager", isCore: true },
      { id: 4, name: "ID Registration", isCore: true },
      { id: 5, name: "Sponsor Approval", isCore: true },
      { id: 6, name: "Earnings", isCore: true },
      { id: 7, name: "Wallet", isCore: true },
      { id: 8, name: "Ranks & Achievements", isCore: true },
    ]
  },
  {
    title: "Commerce & Shopping Sections",
    items: [
      { id: 9, name: "Mega Shopping" },
      { id: 10, name: "Grocery" },
    ]
  }
];

export const DUMMY_VIDEOS = [
  { id: 1, title: "Network Growth", channel: "Paradise Academy", views: "12K views", thumbnail: "https://via.placeholder.com/300" },
  { id: 2, title: "Investment Tips", channel: "Finance Guru", views: "8.5K views", thumbnail: "https://via.placeholder.com/300" },
];

export const DUMMY_CHATS = [
  { id: 1, name: "Sponsor", lastMessage: "Meeting at 5 PM", time: "10:30 AM", avatar: "S", unread: 2 },
  { id: 2, name: "Support", lastMessage: "Ticket Resolved", time: "Yesterday", avatar: "T", unread: 0 },
];