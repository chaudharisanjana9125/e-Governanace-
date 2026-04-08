export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  aadhaar?: string;
  dob?: string;
  gender?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}