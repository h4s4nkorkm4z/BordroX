/// <reference types="vite/client" />

import type { PayrollRecord, Personnel } from "./types/personnel";

type PersonnelFormData = {
  name: string;
  position: string;
  department?: string;
  phone?: string;
  email?: string;
  nationalId?: string;
  birthDate?: string;
  hireDate?: string;
  iban?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  notes?: string;
  photo?: string;
  salary: number;
};

type PayrollFormData = {
  personnelId: number;
  personnelName: string;
  department?: string | null;
  month: string;
  year: string;
  workedDays: string;
  netSalary: number;
  extraPayment: number;
  advancePayment: number;
  totalPayment: number;
};

declare global {
  interface Window {
    bordroxAPI: {
      personnel: {
        list: () => Promise<Personnel[]>;
        create: (data: PersonnelFormData) => Promise<Personnel>;
        update: (id: number, data: PersonnelFormData) => Promise<Personnel>;
        delete: (id: number) => Promise<Personnel>;
      };

      payroll: {
        list: () => Promise<PayrollRecord[]>;
        create: (data: PayrollFormData) => Promise<PayrollRecord>;
        delete: (id: number) => Promise<PayrollRecord>;
      };
    };
  }
}

export {};