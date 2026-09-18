export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface DonorProfile {
  id: string; // UUID
  user_id: string; // UUID referencing auth.users(id)
  full_name: string;
  email: string; // unique, normalized
  phone: string;
  date_of_birth: string; // DATE (YYYY-MM-DD)
  blood_group: BloodGroup;
  email_verified: boolean;
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
}

export type InsertDonorProfile = Omit<DonorProfile, 'id' | 'created_at' | 'updated_at' | 'email_verified'> & {
  email_verified?: boolean;
};

export type UpdateDonorProfile = Partial<InsertDonorProfile>;
