import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Play,
  Pause,
  Check,
  Lock,
  Unlock,
  Star,
  Zap,
  BookOpen,
  Video,
  FileText,
  Award,
  Clock,
  Users,
  TrendingUp,
  Coins,
  Brain,
  Target,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Volume2,
  Mic,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import AstroDoer from "@/components/AstroDoer";

// ============================================
// NEST MATRIX LEVELS (L1-L5)
// ============================================
const NEST_LEVELS = {
  L1: {
    code: "Para",
    name: "Para Capable",
    fullName: "Para-Professional",
    description: "Learning fundamentals, entry-level tasks",
    salary: "₹15K-30K",
    color: "#94A3B8",
    icon: "🌱",
    skills: ["Basic knowledge", "Following instructions", "Learning attitude"]
  },
  L2: {
    code: "Pro",
    name: "Professional Capable",
    fullName: "Professional",
    description: "Core skills developed, junior contributor",
    salary: "₹30K-60K",
    color: "#22C55E",
    icon: "🌿",
    skills: ["Core competency", "Independent work", "Problem awareness"]
  },
  L3: {
    code: "Prod",
    name: "Productive Capable",
    fullName: "Productive Professional",
    description: "Independent contributor, specialized skills",
    salary: "₹60K-1.5L",
    color: "#3B82F6",
    icon: "🌳",
    skills: ["Specialized expertise", "Project ownership", "Client handling"]
  },
  L4: {
    code: "Perf",
    name: "Performer Capable",
    fullName: "High Performer",
    description: "Senior expert, leading teams & mentoring",
    salary: "₹1.5L-5L",
    color: "#8B5CF6",
    icon: "🌲",
    skills: ["Leadership", "Strategic thinking", "Mentoring others"]
  },
  L5: {
    code: "Prof",
    name: "Proficorn Capable",
    fullName: "Proficorn (Exponential)",
    description: "Thought leader, industry expert, building organizations",
    salary: "₹5L+",
    color: "#F59E0B",
    icon: "🚀",
    skills: ["Industry influence", "Innovation", "Business building"]
  }
};

// ============================================
// 12 CAREER DIVISIONS - SKILLING CAPSULES
// ============================================
const DIVISIONS_CAPSULES = {
  legal: {
    id: "legal",
    name: "Legal Services",
    icon: "⚖️",
    color: "#7C3AED",
    tagline: "Guardians of Justice & Compliance",
    description: "Master the art of law, advocacy, and corporate compliance",
    careers: [
      { title: "Advocate/Lawyer", level: "L2-L5", demand: "High" },
      { title: "Corporate Lawyer", level: "L3-L5", demand: "Very High" },
      { title: "Legal Advisor", level: "L3-L4", demand: "High" },
      { title: "Company Secretary", level: "L2-L4", demand: "High" },
      { title: "Paralegal", level: "L1-L2", demand: "Medium" },
      { title: "Legal Tech Specialist", level: "L2-L4", demand: "Very High" },
    ],
    modules: [
      {
        id: "legal_101",
        title: "Legal Foundations",
        level: "L1",
        duration: "4 weeks",
        dcoin: 50,
        topics: [
          "Indian Legal System Overview",
          "Constitutional Law Basics",
          "Legal Terminology & Ethics",
          "Courts Hierarchy & Procedures"
        ]
      },
      {
        id: "legal_201",
        title: "Core Legal Practice",
        level: "L2",
        duration: "8 weeks",
        dcoin: 100,
        topics: [
          "Civil Procedure & Litigation",
          "Criminal Law & Procedure",
          "Law of Contracts",
          "Property Law Essentials"
        ]
      },
      {
        id: "legal_301",
        title: "Corporate & Commercial Law",
        level: "L3",
        duration: "10 weeks",
        dcoin: 150,
        topics: [
          "Company Law & Governance",
          "Mergers & Acquisitions",
          "Intellectual Property Rights",
          "Regulatory Compliance"
        ]
      },
      {
        id: "legal_401",
        title: "Specialized Legal Practice",
        level: "L4",
        duration: "12 weeks",
        dcoin: 200,
        topics: [
          "International Law & Treaties",
          "Cyber Law & Data Privacy",
          "Alternative Dispute Resolution",
          "Legal Strategy & Leadership"
        ]
      },
      {
        id: "legal_501",
        title: "Legal Innovation & Leadership",
        level: "L5",
        duration: "16 weeks",
        dcoin: 300,
        topics: [
          "Legal Tech & AI in Law",
          "Building Legal Practice",
          "Policy Advocacy",
          "Thought Leadership"
        ]
      }
    ]
  },
  policy: {
    id: "policy",
    name: "Policy & Governance",
    icon: "🏛️",
    color: "#8B5CF6",
    tagline: "Shaping Nations & Societies",
    description: "Lead governance, public administration, and policy making",
    careers: [
      { title: "IAS/Civil Servant", level: "L3-L5", demand: "High" },
      { title: "Policy Analyst", level: "L2-L4", demand: "High" },
      { title: "Diplomat", level: "L3-L5", demand: "Medium" },
      { title: "Public Administrator", level: "L2-L4", demand: "High" },
    ],
    modules: [
      { id: "policy_101", title: "Governance Fundamentals", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Indian Polity", "Constitution", "Administration Basics", "Citizenship"] },
      { id: "policy_201", title: "Public Administration", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Bureaucracy", "Policy Process", "E-Governance", "RTI"] },
      { id: "policy_301", title: "Policy Analysis & Design", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Policy Frameworks", "Impact Assessment", "Stakeholder Management", "Implementation"] },
      { id: "policy_401", title: "Strategic Governance", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["International Relations", "Economic Policy", "Crisis Management", "Leadership"] },
      { id: "policy_501", title: "Transformational Leadership", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Nation Building", "Global Governance", "Innovation Policy", "Legacy Creation"] }
    ]
  },
  technology: {
    id: "technology",
    name: "Technology & IT",
    icon: "💻",
    color: "#3B82F6",
    tagline: "Building the Digital Future",
    description: "Master software, AI, data, and emerging technologies",
    careers: [
      { title: "Software Developer", level: "L1-L4", demand: "Very High" },
      { title: "AI/ML Engineer", level: "L2-L5", demand: "Very High" },
      { title: "Data Scientist", level: "L2-L5", demand: "Very High" },
      { title: "DevOps Engineer", level: "L2-L4", demand: "High" },
      { title: "Cybersecurity Analyst", level: "L2-L5", demand: "Very High" },
    ],
    modules: [
      { id: "tech_101", title: "Digital Foundations", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Computer Basics", "Programming Logic", "Internet & Web", "Digital Tools"] },
      { id: "tech_201", title: "Core Development", level: "L2", duration: "10 weeks", dcoin: 100, topics: ["Programming Languages", "Databases", "Web Development", "APIs"] },
      { id: "tech_301", title: "Specialized Tech", level: "L3", duration: "12 weeks", dcoin: 150, topics: ["AI/ML Fundamentals", "Cloud Computing", "Mobile Development", "Security"] },
      { id: "tech_401", title: "Advanced Engineering", level: "L4", duration: "14 weeks", dcoin: 200, topics: ["System Design", "Architecture", "DevOps", "Tech Leadership"] },
      { id: "tech_501", title: "Tech Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Emerging Tech", "Building Products", "Tech Entrepreneurship", "Exponential Impact"] }
    ]
  },
  health: {
    id: "health",
    name: "Health & Wellness",
    icon: "🏥",
    color: "#EC4899",
    tagline: "Healing Lives & Communities",
    description: "Care for physical, mental, and community health",
    careers: [
      { title: "Doctor/Physician", level: "L3-L5", demand: "Very High" },
      { title: "Nurse", level: "L2-L4", demand: "Very High" },
      { title: "Pharmacist", level: "L2-L4", demand: "High" },
      { title: "Physiotherapist", level: "L2-L4", demand: "High" },
      { title: "Mental Health Counselor", level: "L2-L4", demand: "Very High" },
    ],
    modules: [
      { id: "health_101", title: "Health Foundations", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Human Anatomy", "First Aid", "Nutrition Basics", "Hygiene"] },
      { id: "health_201", title: "Healthcare Practice", level: "L2", duration: "10 weeks", dcoin: 100, topics: ["Patient Care", "Medical Terminology", "Healthcare Systems", "Ethics"] },
      { id: "health_301", title: "Clinical Specialization", level: "L3", duration: "12 weeks", dcoin: 150, topics: ["Diagnosis", "Treatment Protocols", "Pharmacology", "Emergency Care"] },
      { id: "health_401", title: "Advanced Healthcare", level: "L4", duration: "14 weeks", dcoin: 200, topics: ["Specializations", "Research", "Hospital Management", "Leadership"] },
      { id: "health_501", title: "Healthcare Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Medical Tech", "Public Health Policy", "Healthcare Entrepreneurship", "Global Health"] }
    ]
  },
  finance: {
    id: "finance",
    name: "Finance & Banking",
    icon: "💰",
    color: "#F59E0B",
    tagline: "Mastering Money & Markets",
    description: "Navigate financial markets, banking, and wealth management",
    careers: [
      { title: "Investment Banker", level: "L3-L5", demand: "High" },
      { title: "Chartered Accountant", level: "L2-L5", demand: "Very High" },
      { title: "Financial Analyst", level: "L2-L4", demand: "High" },
      { title: "Risk Manager", level: "L3-L5", demand: "High" },
    ],
    modules: [
      { id: "finance_101", title: "Financial Literacy", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Money Basics", "Banking", "Savings", "Budgeting"] },
      { id: "finance_201", title: "Accounting & Taxation", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Bookkeeping", "Financial Statements", "Tax Basics", "GST"] },
      { id: "finance_301", title: "Corporate Finance", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Valuation", "Capital Markets", "Investment Analysis", "Risk Management"] },
      { id: "finance_401", title: "Advanced Finance", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["M&A", "Portfolio Management", "Derivatives", "Leadership"] },
      { id: "finance_501", title: "Financial Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["FinTech", "Crypto & Blockchain", "Wealth Building", "Financial Leadership"] }
    ]
  },
  education: {
    id: "education",
    name: "Education & Training",
    icon: "📚",
    color: "#14B8A6",
    tagline: "Shaping Minds & Futures",
    description: "Educate, train, and transform learners of all ages",
    careers: [
      { title: "Teacher", level: "L2-L4", demand: "Very High" },
      { title: "Professor", level: "L4-L5", demand: "High" },
      { title: "Corporate Trainer", level: "L2-L4", demand: "High" },
      { title: "EdTech Specialist", level: "L2-L4", demand: "Very High" },
    ],
    modules: [
      { id: "edu_101", title: "Teaching Foundations", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Learning Theories", "Pedagogy Basics", "Communication", "Ethics"] },
      { id: "edu_201", title: "Classroom Mastery", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Lesson Planning", "Assessment", "Classroom Management", "Technology"] },
      { id: "edu_301", title: "Specialized Education", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Subject Mastery", "Special Needs", "Curriculum Design", "Research"] },
      { id: "edu_401", title: "Educational Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Institution Management", "Policy", "Mentoring", "Innovation"] },
      { id: "edu_501", title: "Education Transformation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["EdTech Innovation", "Global Education", "System Reform", "Legacy Building"] }
    ]
  },
  // Additional divisions with similar structure...
  science: {
    id: "science",
    name: "Science & Research",
    icon: "🔬",
    color: "#06B6D4",
    tagline: "Discovering Tomorrow",
    description: "Research, innovate, and push boundaries of knowledge",
    careers: [
      { title: "Research Scientist", level: "L3-L5", demand: "High" },
      { title: "Lab Technician", level: "L1-L3", demand: "High" },
      { title: "Data Analyst", level: "L2-L4", demand: "Very High" },
    ],
    modules: [
      { id: "sci_101", title: "Scientific Method", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Research Basics", "Data Collection", "Lab Safety", "Documentation"] },
      { id: "sci_201", title: "Applied Research", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Experimentation", "Analysis", "Reporting", "Ethics"] },
      { id: "sci_301", title: "Specialized Research", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Domain Expertise", "Publications", "Funding", "Collaboration"] },
      { id: "sci_401", title: "Research Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Lab Management", "Grants", "Mentoring", "Industry Connect"] },
      { id: "sci_501", title: "Scientific Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Breakthrough Research", "Patents", "Commercialization", "Global Impact"] }
    ]
  },
  security: {
    id: "security",
    name: "Security & Defense",
    icon: "🛡️",
    color: "#EF4444",
    tagline: "Protecting People & Nations",
    description: "Defend, protect, and ensure safety at all levels",
    careers: [
      { title: "Defense Officer", level: "L3-L5", demand: "High" },
      { title: "Police Officer", level: "L2-L4", demand: "High" },
      { title: "Cybersecurity Expert", level: "L2-L5", demand: "Very High" },
    ],
    modules: [
      { id: "sec_101", title: "Security Fundamentals", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Security Basics", "Threat Awareness", "Physical Security", "Ethics"] },
      { id: "sec_201", title: "Professional Security", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Investigation", "Surveillance", "Risk Assessment", "Legal Framework"] },
      { id: "sec_301", title: "Specialized Security", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Cyber Security", "Intelligence", "Crisis Management", "Leadership"] },
      { id: "sec_401", title: "Strategic Security", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["National Security", "Counter-terrorism", "Policy", "Command"] },
      { id: "sec_501", title: "Security Leadership", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Defense Strategy", "Global Security", "Innovation", "Legacy"] }
    ]
  },
  sport: {
    id: "sport",
    name: "Sports & Fitness",
    icon: "🏆",
    color: "#F97316",
    tagline: "Champions of Excellence",
    description: "Excel in sports, fitness, and athletic performance",
    careers: [
      { title: "Professional Athlete", level: "L3-L5", demand: "Medium" },
      { title: "Sports Coach", level: "L2-L4", demand: "High" },
      { title: "Fitness Trainer", level: "L1-L3", demand: "Very High" },
      { title: "Sports Manager", level: "L3-L5", demand: "High" },
    ],
    modules: [
      { id: "sport_101", title: "Fitness Foundations", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Exercise Basics", "Nutrition", "Injury Prevention", "Discipline"] },
      { id: "sport_201", title: "Sports Training", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Coaching Methods", "Performance", "Psychology", "Planning"] },
      { id: "sport_301", title: "Professional Sports", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Competition", "Strategy", "Recovery", "Media"] },
      { id: "sport_401", title: "Sports Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Team Management", "Business", "Mentoring", "Legacy"] },
      { id: "sport_501", title: "Sports Excellence", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Elite Performance", "Institution Building", "Global Sports", "Impact"] }
    ]
  },
  art: {
    id: "art",
    name: "Arts & Design",
    icon: "🎨",
    color: "#F472B6",
    tagline: "Creating Beauty & Impact",
    description: "Design, create, and inspire through visual and performing arts",
    careers: [
      { title: "Graphic Designer", level: "L1-L4", demand: "Very High" },
      { title: "UI/UX Designer", level: "L2-L5", demand: "Very High" },
      { title: "Artist", level: "L2-L5", demand: "Medium" },
      { title: "Fashion Designer", level: "L2-L4", demand: "High" },
    ],
    modules: [
      { id: "art_101", title: "Design Foundations", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Visual Basics", "Color Theory", "Tools", "Creativity"] },
      { id: "art_201", title: "Applied Design", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Digital Design", "Typography", "Branding", "Portfolio"] },
      { id: "art_301", title: "Professional Design", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["UI/UX", "Motion", "3D", "Client Work"] },
      { id: "art_401", title: "Design Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Art Direction", "Team Lead", "Strategy", "Industry"] },
      { id: "art_501", title: "Design Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Design Thinking", "Building Studios", "Global Impact", "Legacy"] }
    ]
  },
  hospitality: {
    id: "hospitality",
    name: "Hospitality & Tourism",
    icon: "🏨",
    color: "#14B8A6",
    tagline: "Creating Memorable Experiences",
    description: "Excel in hospitality, travel, and customer experience",
    careers: [
      { title: "Hotel Manager", level: "L3-L5", demand: "High" },
      { title: "Chef", level: "L2-L5", demand: "High" },
      { title: "Travel Consultant", level: "L1-L3", demand: "Medium" },
      { title: "Event Manager", level: "L2-L4", demand: "High" },
    ],
    modules: [
      { id: "hosp_101", title: "Hospitality Basics", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Customer Service", "Hygiene", "Communication", "Ethics"] },
      { id: "hosp_201", title: "Operations", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Front Office", "Food Service", "Housekeeping", "Technology"] },
      { id: "hosp_301", title: "Management", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Revenue", "Marketing", "HR", "Quality"] },
      { id: "hosp_401", title: "Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Strategy", "Expansion", "Brand", "Innovation"] },
      { id: "hosp_501", title: "Hospitality Excellence", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Chains", "Global Brands", "Luxury", "Legacy"] }
    ]
  },
  food: {
    id: "food",
    name: "Food & Agriculture",
    icon: "🍽️",
    color: "#22C55E",
    tagline: "Feeding the World",
    description: "Innovate in food production, agriculture, and nutrition",
    careers: [
      { title: "Agricultural Scientist", level: "L3-L5", demand: "High" },
      { title: "Food Technologist", level: "L2-L4", demand: "High" },
      { title: "Nutritionist", level: "L2-L4", demand: "Very High" },
      { title: "Farm Manager", level: "L2-L4", demand: "High" },
    ],
    modules: [
      { id: "food_101", title: "Agriculture Basics", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Soil Science", "Crops", "Irrigation", "Sustainability"] },
      { id: "food_201", title: "Food Science", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Processing", "Safety", "Nutrition", "Packaging"] },
      { id: "food_301", title: "Agri-Business", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Supply Chain", "Marketing", "Technology", "Export"] },
      { id: "food_401", title: "Agricultural Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Policy", "Innovation", "Scale", "Mentoring"] },
      { id: "food_501", title: "Food Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["AgriTech", "Climate", "Global Food Security", "Legacy"] }
    ]
  },
  transport: {
    id: "transport",
    name: "Transport & Logistics",
    icon: "✈️",
    color: "#0EA5E9",
    tagline: "Connecting the World",
    description: "Move people, goods, and ideas across the globe",
    careers: [
      { title: "Pilot", level: "L3-L5", demand: "High" },
      { title: "Logistics Manager", level: "L2-L4", demand: "Very High" },
      { title: "Supply Chain Analyst", level: "L2-L4", demand: "Very High" },
      { title: "Maritime Officer", level: "L2-L4", demand: "Medium" },
    ],
    modules: [
      { id: "trans_101", title: "Transport Basics", level: "L1", duration: "4 weeks", dcoin: 50, topics: ["Modes", "Safety", "Regulations", "Geography"] },
      { id: "trans_201", title: "Logistics Operations", level: "L2", duration: "8 weeks", dcoin: 100, topics: ["Warehousing", "Distribution", "Inventory", "Technology"] },
      { id: "trans_301", title: "Supply Chain Management", level: "L3", duration: "10 weeks", dcoin: 150, topics: ["Planning", "Optimization", "Global Trade", "Analytics"] },
      { id: "trans_401", title: "Transport Leadership", level: "L4", duration: "12 weeks", dcoin: 200, topics: ["Fleet Management", "Strategy", "Compliance", "Innovation"] },
      { id: "trans_501", title: "Logistics Innovation", level: "L5", duration: "16 weeks", dcoin: 300, topics: ["Autonomous", "Drones", "Green Logistics", "Future"] }
    ]
  }
};

// Duolingo-style DAILY CAREER CAPSULE content for each module
const DAILY_CAPSULE_CONTENT = {
  legal_101: {
    capsules: [
      {
        id: 1,
        type: "intro",
        title: "Welcome to Legal Foundations",
        content: "You're about to embark on an exciting journey into the world of law! Let's start with the basics of the Indian Legal System.",
        dcoin: 5
      },
      {
        id: 2,
        type: "learn",
        title: "The Indian Constitution",
        content: "The Constitution of India is the supreme law of India. It came into effect on January 26, 1950. It establishes the framework for political principles, procedures, and powers of government.",
        keyPoints: [
          "Longest written constitution in the world",
          "Originally 395 Articles in 22 Parts",
          "Currently 470+ Articles after amendments",
          "Preamble declares India as Sovereign, Socialist, Secular, Democratic Republic"
        ],
        dcoin: 10
      },
      {
        id: 3,
        type: "quiz",
        title: "Quick Check!",
        question: "When did the Indian Constitution come into effect?",
        options: [
          { id: "a", text: "August 15, 1947", correct: false },
          { id: "b", text: "January 26, 1950", correct: true },
          { id: "c", text: "November 26, 1949", correct: false },
          { id: "d", text: "January 26, 1947", correct: false }
        ],
        explanation: "While August 15, 1947 was Independence Day and November 26, 1949 was when the Constitution was adopted, it came into effect on January 26, 1950 - celebrated as Republic Day!",
        dcoin: 15
      },
      {
        id: 4,
        type: "learn",
        title: "Courts Hierarchy in India",
        content: "India follows a three-tier court system with the Supreme Court at the apex.",
        keyPoints: [
          "Supreme Court - Apex court, final interpreter of Constitution",
          "High Courts - One for each state/group of states (25 total)",
          "District Courts - Trial courts at district level",
          "Subordinate Courts - Below district level"
        ],
        dcoin: 10
      },
      {
        id: 5,
        type: "quiz",
        title: "Test Your Knowledge",
        question: "Which is the apex court in India?",
        options: [
          { id: "a", text: "High Court", correct: false },
          { id: "b", text: "District Court", correct: true },
          { id: "c", text: "Supreme Court", correct: true },
          { id: "d", text: "Sessions Court", correct: false }
        ],
        correctId: "c",
        explanation: "The Supreme Court of India is the highest judicial court and the final court of appeal under the Constitution of India.",
        dcoin: 15
      },
      {
        id: 6,
        type: "roleplay",
        title: "🎭 Role Play: The First Day",
        scenario: "You're a fresh law graduate on your first day at a law firm. Your senior partner asks you to explain the basic structure of Indian courts to a client.",
        task: "How would you explain the court hierarchy in simple terms?",
        hints: ["Start with the highest court", "Mention the 3-tier system", "Give a relatable example"],
        dcoin: 20
      },
      {
        id: 7,
        type: "complete",
        title: "Daily Capsule Complete! 🎉",
        content: "Congratulations! You've completed your Daily Career Capsule for Legal Foundations. You now understand the basics of Indian Legal System.",
        achievements: ["Constitution Basics", "Court Hierarchy", "First Role Play"],
        totalDcoin: 50
      }
    ]
  }
};

// EXPERT GRID STRUCTURE - Industry Influencers for Trust & Validation
const DIVISION_EXPERTS = {
  legal: {
    coordinator: ["Raghavendra", "Parimala Rangaraju"],
    mentors: ["Venkat Raghavan", "Naveen Nagarjuna", "Darpan Manjunath", "Prof. Rajashree"],
    influencers: ["Vivek Reddy (Sr. Advocate High Court)", "Shailesh Madiyal (Sr. Advocate)", "Sanjay Nuli"],
    organizations: ["Advocate Association of Bengaluru", "Justiciable Law Chambers"],
    aiAgent: "AI Lawyer"
  },
  policy: {
    coordinator: ["Shivakumar Gowda", "Chandrakala MG"],
    mentors: ["Nikhil Gowda", "Rakshith Shivaram (INC)", "Irasis Acharya (BJP)", "Huda Zariwala (AAP)"],
    influencers: ["B C Getha", "Dr. Gouri Trivedi", "Tejaswini Shriramesh", "Nayana Motamma"],
    organizations: ["Best Foundation", "Test Foundation", "Rotary International"],
    aiAgent: "AI Policy Advisor"
  },
  technology: {
    coordinator: ["Gautham"],
    mentors: ["Prof. Nanjesh AEA Member", "Pavan Setty", "HOD. Gautham"],
    influencers: ["Jaishankar Brigade", "Ravishankar Embedded Systems"],
    organizations: ["Global Village Tech Park", "Bagmane Tech Park"],
    aiAgent: "AI Tech Mentor"
  },
  health: {
    coordinator: ["Dr. Preetham"],
    mentors: ["Dr. Vidyasagar", "Dr. Abhishek", "Dr. Padmini", "Dr. Smitha"],
    influencers: ["Dr. Shekhar Subbiah", "Dr. Vivek Shetty"],
    organizations: ["Kangaroo Care Hospitals", "Narayana Health"],
    aiAgent: "AI Doctor"
  },
  finance: {
    coordinator: ["Srinivas Babu"],
    mentors: ["Bhadrinath Simha Sir", "NBFC Avinash", "Investment Banking Mutthuraj"],
    influencers: ["KTG Group Kimmane Jairam"],
    organizations: ["BSKN & Co", "GD Associates", "KMC Bank"],
    aiAgent: "AI Banker"
  },
  education: {
    coordinator: ["Neha Vivek"],
    mentors: ["Shravya Abhishek", "Dr. Rakesh", "Dr. Yatindhra"],
    influencers: ["Srikanthiah", "Naveen", "Vivekanand Siddhaih", "Ashok Gowda"],
    organizations: ["Trio International", "NPS Jaynagar", "AIT Campus"],
    aiAgent: "AI Tutor"
  },
  science: {
    coordinator: ["Abhishek"],
    mentors: ["Dr. Sheethal", "Prof. Mahendra", "Prof. Antony (Botanist)", "Prof. Shilali Gautham"],
    influencers: ["Dileep Suvarna (Chairman, Micro Labs)"],
    organizations: ["Nehru Planetarium", "PARSEC Laboratory"],
    aiAgent: "AI Researcher"
  },
  security: {
    coordinator: ["Srinivas P C", "Shivakumar"],
    mentors: ["Ex.Army Abijeeth", "IPS Mithun Gowda", "DCP Economic Offence Sharath", "ACP Bharath Reddy"],
    influencers: ["Commissioner Bhaskar Rao", "Brigadier Ashwin"],
    organizations: ["Secure Drills", "Detective Agency and Protection Services"],
    aiAgent: "AI Security Guard"
  },
  sport: {
    coordinator: ["Dileep Kumar"],
    mentors: ["Sport Therapist Mahati Srinivasan"],
    influencers: ["Gopi Thonakal (Olympian & Asian Champion)"],
    organizations: ["Wellness Sports Inc"],
    aiAgent: "AI Fitness Coach"
  },
  food: {
    coordinator: ["Prasad Anerao", "Shruthi"],
    mentors: ["Dr. Shyam", "Preetham Shetty"],
    influencers: ["CCD Dr. Pradeep Kenjige"],
    organizations: ["The Coast", "Kings Club"],
    aiAgent: "AI Nutritionist"
  },
  art: {
    coordinator: ["Shreyas", "Suma"],
    mentors: ["Painter Vinuthan", "Actor Anand"],
    influencers: ["VC Borlingaiah"],
    organizations: ["KalaGrama"],
    aiAgent: "AI Creative Director"
  },
  hospitality: {
    coordinator: ["Avinash"],
    mentors: ["Racer Vikram"],
    influencers: ["Rakesh Reddy"],
    organizations: ["Custom Endless"],
    aiAgent: "AI Travel Planner"
  },
  transport: {
    coordinator: ["Avinash"],
    mentors: ["Racer Vikram"],
    influencers: ["Rakesh Reddy"],
    organizations: ["Custom Endless"],
    aiAgent: "AI Travel Planner"
  }
};

// Generate generic capsules for modules without specific content
const generateGenericCapsules = (module, division) => ({
  capsules: [
    {
      id: 1,
      type: "intro",
      title: `Welcome to ${module.title}`,
      content: `You're starting ${module.title} in ${division.name}. This ${module.duration} journey will take you from ${module.level} concepts to practical application.`,
      dcoin: 5
    },
    {
      id: 2,
      type: "learn",
      title: `${module.topics[0]}`,
      content: `Let's explore the fundamentals of ${module.topics[0]}. This is a critical concept in ${division.name}.`,
      keyPoints: module.topics.map(t => `Master ${t}`),
      dcoin: 10
    },
    {
      id: 3,
      type: "quiz",
      title: "Quick Assessment",
      question: `What is the primary focus of ${module.title}?`,
      options: [
        { id: "a", text: module.topics[0], correct: true },
        { id: "b", text: "General Knowledge", correct: false },
        { id: "c", text: "Unrelated Skills", correct: false },
        { id: "d", text: "Basic Mathematics", correct: false }
      ],
      explanation: `${module.topics[0]} is indeed a core focus of this module!`,
      dcoin: 15
    },
    {
      id: 4,
      type: "roleplay",
      title: "🎭 Practice Scenario",
      scenario: `Imagine you're working in ${division.name}. A colleague needs help understanding ${module.topics[1]}.`,
      task: "How would you explain this concept clearly?",
      hints: ["Use simple language", "Give real examples", "Connect to daily life"],
      dcoin: 20
    },
    {
      id: 5,
      type: "complete",
      title: "Daily Capsule Progress! 🎉",
      content: `Great work! You've made progress in ${module.title}. Keep going to unlock more content!`,
      achievements: module.topics.slice(0, 2),
      totalDcoin: module.dcoin
    }
  ]
});

export default function RolePlayCapsules() {
  const navigate = useNavigate();
  const { divisionId } = useParams();
  const { language, t } = useLanguage();
  
  const [selectedDivision, setSelectedDivision] = useState(divisionId || null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [userLevel, setUserLevel] = useState("L1");
  const [completedModules, setCompletedModules] = useState([]);
  const [earnedDcoins, setEarnedDcoins] = useState(0);
  
  // Lesson state
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonMode, setLessonMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [rolePlayResponse, setRolePlayResponse] = useState("");
  const [lessonProgress, setLessonProgress] = useState(0);

  const division = selectedDivision ? DIVISIONS_CAPSULES[selectedDivision] : null;
  
  // Get capsules for current module
  const getCapsulesForModule = (module) => {
    if (DAILY_CAPSULE_CONTENT[module?.id]) {
      return DAILY_CAPSULE_CONTENT[module.id];
    }
    if (module && division) {
      return generateGenericCapsules(module, division);
    }
    return { capsules: [] };
  };
  
  const currentCapsules = selectedModule ? getCapsulesForModule(selectedModule) : { capsules: [] };
  const currentCapsule = currentCapsules.capsules[currentLessonIndex];
  
  // Start a capsule
  const startLesson = (module) => {
    setSelectedModule(module);
    setCurrentLessonIndex(0);
    setLessonMode(true);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setRolePlayResponse("");
    setLessonProgress(0);
  };
  
  // Handle next capsule
  const nextLesson = () => {
    if (currentCapsule?.dcoin) {
      setEarnedDcoins(prev => prev + currentCapsule.dcoin);
    }
    
    if (currentLessonIndex < currentCapsules.capsules.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setRolePlayResponse("");
      setLessonProgress(((currentLessonIndex + 1) / currentCapsules.capsules.length) * 100);
    } else {
      // Module complete
      setCompletedModules(prev => [...prev, selectedModule.id]);
      setLessonMode(false);
      setSelectedModule(null);
      toast.success(`Daily Capsule Complete! +${selectedModule.dcoin} D-COIN earned!`);
    }
  };
  
  // Handle quiz answer
  const handleQuizAnswer = (option) => {
    setSelectedAnswer(option.id);
    setShowExplanation(true);
  };

  // Render Division Selection
  const renderDivisionGrid = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
          <BookOpen className="w-3 h-3 mr-1" /> 12 DIVISIONS • 60+ CAPSULES
        </Badge>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Division</h2>
        <p className="text-white/60 text-sm">Select a career cluster to explore Role Play Capsules</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.values(DIVISIONS_CAPSULES).map((div, idx) => (
          <motion.div
            key={div.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card 
              className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
              onClick={() => setSelectedDivision(div.id)}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: div.color + '30' }}
                >
                  {div.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{div.name}</h3>
                <p className="text-white/50 text-[10px] mb-2">{div.tagline}</p>
                <Badge className="bg-white/10 text-white/70 border-0 text-[10px]">
                  {div.modules.length} Capsules
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render Division Detail
  const renderDivisionDetail = () => {
    if (!division) return null;

    return (
      <div className="space-y-6">
        {/* Division Header */}
        <div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: division.color + '30' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {division.icon}
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-1">{division.name}</h2>
          <p className="text-white/60 text-sm mb-2">{division.tagline}</p>
          <p className="text-white/40 text-xs max-w-md mx-auto">{division.description}</p>
        </div>

        {/* NEST Level Progress */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-3 text-center">
              Your NEST Level Progress
            </p>
            <div className="flex justify-between items-center gap-2">
              {Object.entries(NEST_LEVELS).map(([key, level]) => (
                <div 
                  key={key}
                  className={`flex-1 text-center p-2 rounded-lg transition-all ${
                    key === userLevel ? 'bg-white/20' : 'bg-white/5'
                  }`}
                >
                  <span className="text-lg block">{level.icon}</span>
                  <span className={`text-[10px] font-medium ${
                    key === userLevel ? 'text-white' : 'text-white/40'
                  }`}>{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Careers in this Division */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Careers in {division.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {division.careers.map((career, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-white text-sm">{career.title}</span>
                  <div className="flex gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[10px]">
                      {career.level}
                    </Badge>
                    <Badge className={`border-0 text-[10px] ${
                      career.demand === 'Very High' ? 'bg-green-500/20 text-green-400' :
                      career.demand === 'High' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {career.demand} Demand
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Play Capsules */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: division.color }} />
            Role Play Capsules (L1 → L5)
          </h3>
          
          {division.modules.map((module, idx) => {
            const levelInfo = NEST_LEVELS[module.level];
            const isUnlocked = idx === 0 || completedModules.includes(division.modules[idx - 1]?.id);
            const isCompleted = completedModules.includes(module.id);
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className={`border transition-all cursor-pointer ${
                    isCompleted ? 'bg-green-500/10 border-green-500/30' :
                    isUnlocked ? 'bg-white/5 border-white/10 hover:bg-white/10' :
                    'bg-white/2 border-white/5 opacity-60'
                  }`}
                  onClick={() => isUnlocked && startLesson(module)}
                  data-testid={`module-${module.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Level Badge */}
                      <div 
                        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: levelInfo.color + '30' }}
                      >
                        <span className="text-lg">{levelInfo.icon}</span>
                        <span className="text-[10px] font-bold text-white">{module.level}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-semibold">{module.title}</h4>
                          {isCompleted ? (
                            <Badge className="bg-green-500 text-white border-0 text-[10px]">
                              <Check className="w-3 h-3 mr-1" /> Complete
                            </Badge>
                          ) : isUnlocked ? (
                            <Badge className="bg-white/20 text-white border-0 text-[10px]">
                              <Unlock className="w-3 h-3 mr-1" /> Start
                            </Badge>
                          ) : (
                            <Badge className="bg-white/10 text-white/40 border-0 text-[10px]">
                              <Lock className="w-3 h-3 mr-1" /> Locked
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-white/50 text-xs mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {module.duration}
                          </span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <Coins className="w-3 h-3" /> +{module.dcoin} D-COIN
                          </span>
                        </div>
                        
                        {/* Topics */}
                        <div className="flex flex-wrap gap-1">
                          {module.topics.map((topic, tIdx) => (
                            <Badge key={tIdx} className="bg-white/5 text-white/60 border-0 text-[8px]">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
          onClick={() => setSelectedDivision(null)}
          data-testid="back-to-divisions-btn"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Divisions
        </Button>
      </div>
    );
  };

  // Render Capsule Mode (Duolingo-style Daily Career Capsules)
  const renderLessonMode = () => {
    if (!currentCapsule || !selectedModule) return null;
    
    const levelInfo = NEST_LEVELS[selectedModule.level];
    const experts = DIVISION_EXPERTS[selectedDivision] || {};
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Capsule Header with Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
              onClick={() => {
                setLessonMode(false);
                setSelectedModule(null);
              }}
              data-testid="exit-lesson-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Exit
            </Button>
            <Badge 
              className="border-0 text-[10px]"
              style={{ backgroundColor: levelInfo.color + '30', color: levelInfo.color }}
            >
              {selectedModule.title} • {selectedModule.level}
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-400 border-0">
              <Coins className="w-3 h-3 mr-1" /> +{currentCapsule.dcoin || 0}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress value={lessonProgress} className="h-2 bg-white/10" />
            <span className="absolute right-0 top-3 text-white/40 text-[10px]">
              {currentLessonIndex + 1} / {currentCapsules.capsules.length}
            </span>
          </div>
        </div>

        {/* Capsule Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLessonIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* INTRO Type */}
            {currentCapsule.type === "intro" && (
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center"
                  >
                    <Play className="w-10 h-10 text-purple-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-3">{currentLesson.title}</h2>
                  <p className="text-white/70 leading-relaxed">{currentLesson.content}</p>
                  
                  <Button
                    className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    onClick={nextLesson}
                    data-testid="start-lesson-btn"
                  >
                    Let&apos;s Begin! <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* LEARN Type */}
            {currentLesson.type === "learn" && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                  </div>
                  
                  <p className="text-white/70 mb-4 leading-relaxed">{currentLesson.content}</p>
                  
                  {currentLesson.keyPoints && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
                      <p className="text-blue-400 text-sm font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4" /> Key Points
                      </p>
                      {currentLesson.keyPoints.map((point, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 text-white/80 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={nextLesson}
                    data-testid="continue-lesson-btn"
                  >
                    Got it! Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* QUIZ Type */}
            {currentLesson.type === "quiz" && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                  </div>
                  
                  <p className="text-white text-lg mb-6">{currentLesson.question}</p>
                  
                  <div className="space-y-3">
                    {currentLesson.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const showResult = showExplanation;
                      const isCorrect = option.correct || option.id === currentLesson.correctId;
                      
                      return (
                        <motion.button
                          key={option.id}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-500/20 border-2 border-green-500'
                                : isSelected
                                  ? 'bg-red-500/20 border-2 border-red-500'
                                  : 'bg-white/5 border border-white/10'
                              : isSelected
                                ? 'bg-purple-500/20 border-2 border-purple-500'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => !showExplanation && handleQuizAnswer(option)}
                          disabled={showExplanation}
                          data-testid={`quiz-option-${option.id}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-500 text-white'
                                : isSelected
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-white/60'
                              : isSelected
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/10 text-white/60'
                          }`}>
                            {option.id.toUpperCase()}
                          </div>
                          <span className="text-white flex-1">{option.text}</span>
                          {showResult && isCorrect && <Check className="w-5 h-5 text-green-400" />}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                    >
                      <p className="text-amber-400 text-sm font-semibold mb-1">💡 Explanation</p>
                      <p className="text-white/70 text-sm">{currentLesson.explanation}</p>
                    </motion.div>
                  )}
                  
                  {showExplanation && (
                    <Button
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                      onClick={nextLesson}
                      data-testid="next-after-quiz-btn"
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ROLEPLAY Type */}
            {currentLesson.type === "roleplay" && (
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-orange-400" />
                    <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Scenario</p>
                    <p className="text-white">{currentLesson.scenario}</p>
                  </div>
                  
                  <div className="bg-orange-500/10 rounded-xl p-4 mb-4">
                    <p className="text-orange-400 text-sm font-semibold mb-2">🎯 Your Task</p>
                    <p className="text-white/80">{currentLesson.task}</p>
                  </div>
                  
                  {currentLesson.hints && (
                    <div className="mb-4">
                      <p className="text-white/50 text-xs mb-2">💡 Hints:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentLesson.hints.map((hint, idx) => (
                          <Badge key={idx} className="bg-white/10 text-white/70 border-0 text-xs">
                            {hint}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <textarea
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-orange-500/50"
                    placeholder="Type your response here... (This is a practice exercise)"
                    value={rolePlayResponse}
                    onChange={(e) => setRolePlayResponse(e.target.value)}
                    data-testid="roleplay-textarea"
                  />
                  
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    onClick={nextLesson}
                    disabled={rolePlayResponse.length < 10}
                    data-testid="submit-roleplay-btn"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Submit Response <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* COMPLETE Type */}
            {currentLesson.type === "complete" && (
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Award className="w-12 h-12 text-green-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{currentLesson.title}</h2>
                  <p className="text-white/70 mb-4">{currentLesson.content}</p>
                  
                  {currentLesson.achievements && (
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {currentLesson.achievements.map((achievement, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <Star className="w-3 h-3 mr-1" /> {achievement}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-amber-500/20 rounded-xl p-4 inline-flex items-center gap-2"
                  >
                    <Coins className="w-6 h-6 text-amber-400" />
                    <span className="text-2xl font-bold text-amber-400">+{currentLesson.totalDcoin}</span>
                    <span className="text-amber-400/70">D-COIN Earned!</span>
                  </motion.div>
                  
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    onClick={nextLesson}
                    data-testid="complete-module-btn"
                  >
                    <Award className="w-4 h-4 mr-2" /> Claim Rewards & Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => {
              if (lessonMode) {
                setLessonMode(false);
                setSelectedModule(null);
              } else if (selectedDivision) {
                setSelectedDivision(null);
              } else {
                navigate(-1);
              }
            }}
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-white font-bold">
              {lessonMode ? selectedModule?.title : "Role Play Capsules"}
            </h1>
            <p className="text-white/50 text-xs">
              {lessonMode ? `${selectedModule?.level} • ${division?.name}` : "Skill Up • Level Up • Earn D-COIN"}
            </p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-0">
            <Coins className="w-3 h-3 mr-1" /> {earnedDcoins}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {lessonMode 
          ? renderLessonMode() 
          : selectedDivision 
            ? renderDivisionDetail() 
            : renderDivisionGrid()
        }
      </main>

      {/* Floating Astro */}
      <div className="fixed bottom-20 right-4 z-40">
        <AstroDoer message="tip" size="sm" showBubble={false} />
      </div>
    </div>
  );
}
