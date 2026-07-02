export type Page = "dashboard" | "personnel" | "payroll" | "reports";

export type Personnel = {
  id: number;
  name: string;
  position: string;
  phone?: string | null;
  email?: string | null;
  nationalId?: string | null;
  iban?: string | null;
  hireDate?: string | null;
  notes?: string | null;
  salary: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};