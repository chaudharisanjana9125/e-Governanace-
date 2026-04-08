// E-Governance Data Store using localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  aadhaar?: string;
  dob?: string;
  gender?: string;
  role: 'citizen' | 'admin';
  department?: string;
  avatar?: string;
  createdAt: string;
}



export interface Application {
  id: string;

  citizenId: string;
  citizenName: string;
  citizenEmail: string;

  serviceType: string;
  serviceId: string;

  status: 'pending' | 'processing' | 'approved' | 'rejected';
  priority: 'normal' | 'urgent';

  details: Record<string, string>;

  submittedAt: string;
  updatedAt: string;

  referenceNo: string;
  timeline: TimelineEvent[];

  // ✅ FIX (IMPORTANT)
  adminNote?: string;
  assignedTo?: string;   // ⭐ ADD THIS LINE ONLY
}
export interface TimelineEvent {
  status: string;
  message: string;
  timestamp: string;
  by?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  processingTime: string;
  fee: string;
  color: string;
  fields: ServiceField[];
}

export interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

// Available Government Services
export const SERVICES: Service[] = [
  {
    id: 'birth-cert',
    name: 'Birth Certificate',
    category: 'Civil Registration',
    description: 'Apply for official birth certificate for newborns or replacement copies',
    icon: '👶',
    processingTime: '7-10 working days',
    fee: '₹50',
    color: 'blue',
    fields: [
      { name: 'childName', label: 'Child Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true, placeholder: 'Hospital/City' },
      { name: 'fatherName', label: "Father's Name", type: 'text', required: true, placeholder: 'Enter father name' },
      { name: 'motherName', label: "Mother's Name", type: 'text', required: true, placeholder: 'Enter mother name' },
      { name: 'address', label: 'Permanent Address', type: 'textarea', required: true, placeholder: 'Enter complete address' },
    ]
  },
  {
    id: 'income-cert',
    name: 'Income Certificate',
    category: 'Revenue Department',
    description: 'Get certified income certificate for scholarships, loans and government schemes',
    icon: '💰',
    processingTime: '5-7 working days',
    fee: '₹30',
    color: 'green',
    fields: [
      { name: 'annualIncome', label: 'Annual Income (₹)', type: 'number', required: true, placeholder: 'Enter annual income' },
      { name: 'occupation', label: 'Occupation', type: 'text', required: true, placeholder: 'e.g. Farmer, Teacher' },
      { name: 'purpose', label: 'Purpose of Certificate', type: 'select', required: true, options: ['Scholarship', 'Bank Loan', 'Government Scheme', 'Education', 'Other'] },
      { name: 'familyMembers', label: 'Number of Family Members', type: 'number', required: true, placeholder: 'Enter count' },
      { name: 'address', label: 'Residential Address', type: 'textarea', required: true, placeholder: 'Enter complete address' },
    ]
  },
  {
    id: 'caste-cert',
    name: 'Caste Certificate',
    category: 'Revenue Department',
    description: 'Apply for caste certificate for reservations and government benefits',
    icon: '📋',
    processingTime: '10-15 working days',
    fee: '₹50',
    color: 'purple',
    fields: [
      { name: 'caste', label: 'Caste/Community', type: 'text', required: true, placeholder: 'Enter caste name' },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['SC', 'ST', 'OBC', 'EWS', 'General'] },
      { name: 'purpose', label: 'Purpose', type: 'select', required: true, options: ['Education Admission', 'Job Application', 'Government Scheme', 'Election', 'Other'] },
      { name: 'address', label: 'Permanent Address', type: 'textarea', required: true, placeholder: 'Enter complete address' },
    ]
  },
  {
    id: 'domicile-cert',
    name: 'Domicile Certificate',
    category: 'Revenue Department',
    description: 'Proof of residence certificate for state benefits and admissions',
    icon: '🏠',
    processingTime: '7-10 working days',
    fee: '₹40',
    color: 'amber',
    fields: [
      { name: 'yearsOfResidence', label: 'Years of Residence in State', type: 'number', required: true, placeholder: 'Enter years' },
      { name: 'purpose', label: 'Purpose', type: 'select', required: true, options: ['Education', 'Employment', 'Government Scheme', 'Property', 'Other'] },
      { name: 'address', label: 'Current Address', type: 'textarea', required: true, placeholder: 'Enter complete address' },
      { name: 'previousAddress', label: 'Previous Address (if any)', type: 'textarea', required: false, placeholder: 'Enter previous address' },
    ]
  },
  {
    id: 'marriage-cert',
    name: 'Marriage Certificate',
    category: 'Civil Registration',
    description: 'Register marriage and obtain official marriage certificate',
    icon: '💍',
    processingTime: '15-20 working days',
    fee: '₹100',
    color: 'pink',
    fields: [
      { name: 'groomName', label: "Groom's Full Name", type: 'text', required: true, placeholder: 'Enter groom name' },
      { name: 'brideName', label: "Bride's Full Name", type: 'text', required: true, placeholder: 'Enter bride name' },
      { name: 'marriageDate', label: 'Date of Marriage', type: 'date', required: true },
      { name: 'marriagePlace', label: 'Place of Marriage', type: 'text', required: true, placeholder: 'Venue/City' },
      { name: 'witnessName1', label: 'Witness 1 Name', type: 'text', required: true, placeholder: 'Enter name' },
      { name: 'witnessName2', label: 'Witness 2 Name', type: 'text', required: true, placeholder: 'Enter name' },
    ]
  },
  {
    id: 'driving-license',
    name: 'Driving License',
    category: 'Transport Department',
    description: 'Apply for new driving license or renewal of existing license',
    icon: '🚗',
    processingTime: '20-30 working days',
    fee: '₹200',
    color: 'teal',
    fields: [
      { name: 'licenseType', label: 'License Type', type: 'select', required: true, options: ['Two Wheeler', 'Four Wheeler', 'Commercial Vehicle', 'Both (2W+4W)'] },
      { name: 'applicationType', label: 'Application Type', type: 'select', required: true, options: ['New License', 'Renewal', 'Duplicate'] },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'bloodGroup', label: 'Blood Group', type: 'select', required: true, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { name: 'address', label: 'Permanent Address', type: 'textarea', required: true, placeholder: 'Enter complete address' },
    ]
  },
  {
    id: 'ration-card',
    name: 'Ration Card',
    category: 'Food & Civil Supplies',
    description: 'Apply for new ration card or modification in existing ration card',
    icon: '🍚',
    processingTime: '30-45 working days',
    fee: 'Free',
    color: 'orange',
    fields: [
      { name: 'cardType', label: 'Card Type', type: 'select', required: true, options: ['APL (Above Poverty Line)', 'BPL (Below Poverty Line)', 'AAY (Antyodaya)'] },
      { name: 'familyMembers', label: 'Total Family Members', type: 'number', required: true, placeholder: 'Enter count' },
      { name: 'headOfFamily', label: 'Head of Family Name', type: 'text', required: true, placeholder: 'Enter name' },
      { name: 'monthlyIncome', label: 'Monthly Family Income (₹)', type: 'number', required: true, placeholder: 'Enter income' },
      { name: 'address', label: 'Residential Address', type: 'textarea', required: true, placeholder: 'Enter complete address' },
    ]
  },
  {
    id: 'property-tax',
    name: 'Property Tax',
    category: 'Municipal Services',
    description: 'Pay property tax, obtain receipts and NOC for property transactions',
    icon: '🏢',
    processingTime: '3-5 working days',
    fee: 'As applicable',
    color: 'indigo',
    fields: [
      { name: 'propertyId', label: 'Property ID / Survey No.', type: 'text', required: true, placeholder: 'Enter property ID' },
      { name: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['Residential', 'Commercial', 'Industrial', 'Agricultural'] },
      { name: 'propertyArea', label: 'Property Area (sq ft)', type: 'number', required: true, placeholder: 'Enter area' },
      { name: 'address', label: 'Property Address', type: 'textarea', required: true, placeholder: 'Enter property address' },
    ]
  }
];

// Generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const generateRefNo = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `EGS${year}${random}`;
};

// User Store
export const userStore = {
  getAll: (): User[] => {
    return JSON.parse(localStorage.getItem('egov_users') || '[]');
  },
  save: (users: User[]) => {
    localStorage.setItem('egov_users', JSON.stringify(users));
  },
  add: (user: User) => {
    const users = userStore.getAll();
    users.push(user);
    userStore.save(users);
  },
  findByEmail: (email: string): User | undefined => {
    return userStore.getAll().find(u => u.email === email);
  },
  findById: (id: string): User | undefined => {
    return userStore.getAll().find(u => u.id === id);
  },
  update: (id: string, updates: Partial<User>) => {
    const users = userStore.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      userStore.save(users);
      return users[idx];
    }
    return null;
  }
};



// Auth Store
export const authStore = {
  setCurrentUser: (user: User) => {
    localStorage.setItem('egov_current_user', JSON.stringify(user));
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('egov_current_user');
    return data ? JSON.parse(data) : null;
  },
  logout: () => {
    localStorage.removeItem('egov_current_user');
  },
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('egov_current_user');
  }
};


    // Add demo citizen
   if (!userStore.findByEmail('citizen@egov.in')) {
  userStore.add({
    id: 'citizen-001',
    name: 'Priya Sharma',
    email: 'citizen@egov.in',
    password: 'citizen123',
    phone: '9123456789',
    address: '123, MG Road, Bengaluru, Karnataka',
    aadhaar: '1234-5678-9012',
    dob: '1995-06-15',
    gender: 'Female',
    role: 'citizen',
    createdAt: new Date().toISOString()
  });
}

  export const applicationStore = {
  getAll: (): Application[] => {
    return JSON.parse(localStorage.getItem('egov_applications') || '[]');
  },

  save: (apps: Application[]) => {
    localStorage.setItem('egov_applications', JSON.stringify(apps));
  },

  add: (app: Application) => {
    const apps = applicationStore.getAll();
    apps.push(app);
    applicationStore.save(apps);
  },

  findByUser: (citizenId: string): Application[] => {
    return applicationStore.getAll().filter(a => a.citizenId === citizenId);
  }
};

  // Initialize demo data
const apps = applicationStore.getAll();
  if (apps.length === 0) {
    // Add demo applications
    const demoApps: Application[] = [
      {
        id: 'app-001',
        citizenId: 'citizen-001',
        citizenName: 'Priya Sharma',
        citizenEmail: 'citizen@egov.in',
        serviceType: 'Income Certificate',
        serviceId: 'income-cert',
        status: 'approved',
        priority: 'normal',
        details: { annualIncome: '360000', occupation: 'Teacher', purpose: 'Scholarship', familyMembers: '4', address: '123 MG Road Bengaluru' },
        submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        referenceNo: 'EGS2024001234',
        timeline: [
          { status: 'submitted', message: 'Application submitted successfully', timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
          { status: 'processing', message: 'Application under review by Revenue Department', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), by: 'Rajesh Kumar' },
          { status: 'approved', message: 'Application approved. Certificate ready for download', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), by: 'Rajesh Kumar' },
        ],
        adminNote: 'Approved successfully'
      },
      {
        id: 'app-002',
        citizenId: 'citizen-001',
        citizenName: 'Priya Sharma',
        citizenEmail: 'citizen@egov.in',
        serviceType: 'Birth Certificate',
        serviceId: 'birth-cert',
        status: 'processing',
        priority: 'urgent',
        details: { childName: 'Aryan Sharma', dob: '2024-01-10', placeOfBirth: 'Apollo Hospital, Bengaluru', fatherName: 'Amit Sharma', motherName: 'Priya Sharma', address: '123 MG Road Bengaluru' },
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        referenceNo: 'EGS2024005678',
        timeline: [
          { status: 'submitted', message: 'Application submitted successfully', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { status: 'processing', message: 'Documents under verification', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), by: 'Rajesh Kumar' },
        ],
        adminNote: 'Approved successfully'
      },
      {
        id: 'app-003',
        citizenId: 'citizen-001',
        citizenName: 'Priya Sharma',
        citizenEmail: 'citizen@egov.in',
        serviceType: 'Driving License',
        serviceId: 'driving-license',
        status: 'pending',
        priority: 'normal',
        details: { licenseType: 'Four Wheeler', applicationType: 'New License', dob: '1995-06-15', bloodGroup: 'B+', address: '123 MG Road Bengaluru' },
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        referenceNo: 'EGS2024009012',
        timeline: [
          { status: 'submitted', message: 'Application submitted successfully', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        adminNote: 'Rejected due to missing document'
      }
    ];
    demoApps.forEach(app => applicationStore.add(app));
  }

