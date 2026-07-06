export type Page = "dashboard" | "personnel" | "payroll" | "reports";

export type Personnel = {
  id: number;
  name: string;
  position: string;
  department?: string | null;
  phone?: string | null;
  email?: string | null;
  nationalId?: string | null;
  birthDate?: string | null;
  hireDate?: string | null;
  iban?: string | null;
  address?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  notes?: string | null;
  photo?: string | null;
  salary: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};