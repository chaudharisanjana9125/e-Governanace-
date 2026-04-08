// ✅ Step 1: Pehle type define karo (TOP pe)

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  processingTime: string;
  fee: string;
  color: string;
  icon: string;
  fields: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
  }[];
};

// ✅ Step 2: Uske baad SERVICES array likho

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Birth Certificate',
    category: 'Municipal',
    description: 'Apply for birth certificate',
    processingTime: '7 days',
    fee: '₹50',
    icon: '📄',
    color: 'blue',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true }
    ]
  },
  {
    id: '2',
    name: 'Death Certificate',
    category: 'Municipal',
    description: 'Apply for death certificate',
    processingTime: '5 days',
    fee: '₹30',
    icon: '🪦',
    color: 'red',
    fields: [
      { name: 'deceased_name', label: 'Deceased Name', type: 'text', required: true },
      { name: 'death_date', label: 'Date of Death', type: 'date', required: true }
    ]
  },
  {
    id: '3',
    name: 'Income Certificate',
    category: 'Revenue',
    description: 'Apply for income certificate',
    processingTime: '10 days',
    fee: '₹100',
    icon: '💰',
    color: 'green',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'income', label: 'Annual Income', type: 'number', required: true }
    ]
  },
  {
    id: '4',
    name: 'Caste Certificate',
    category: 'Revenue',
    description: 'Apply for caste certificate',
    processingTime: '8 days',
    fee: '₹60',
    icon: '📑',
    color: 'purple',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'caste', label: 'Caste', type: 'text', required: true }
    ]
  },
  {
    id: '5',
    name: 'Domicile Certificate',
    category: 'State',
    description: 'Apply for domicile certificate',
    processingTime: '12 days',
    fee: '₹80',
    icon: '🏠',
    color: 'orange',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'text', required: true }
    ]
  },
  {
    id: '6',
    name: 'Marriage Certificate',
    category: 'Municipal',
    description: 'Apply for marriage certificate',
    processingTime: '15 days',
    fee: '₹150',
    icon: '💍',
    color: 'pink',
    fields: [
      { name: 'husband_name', label: 'Husband Name', type: 'text', required: true },
      { name: 'wife_name', label: 'Wife Name', type: 'text', required: true }
    ]
  }
];