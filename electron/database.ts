import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

type PersonnelData = {
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

type PayrollData = {
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

export const database = {
  personnel: {
    list() {
      return prisma.personnel.findMany({
        orderBy: { createdAt: "desc" },
      });
    },

    create(data: PersonnelData) {
      return prisma.personnel.create({ data });
    },

    update(id: number, data: PersonnelData) {
      return prisma.personnel.update({
        where: { id },
        data,
      });
    },

    delete(id: number) {
      return prisma.personnel.delete({
        where: { id },
      });
    },
  },

  payroll: {
    list() {
      return prisma.payroll.findMany({
        orderBy: { createdAt: "desc" },
      });
    },

    create(data: PayrollData) {
      return prisma.payroll.create({
        data: {
          personnelId: Number(data.personnelId),
          personnelName: data.personnelName,
          department: data.department || null,
          month: data.month,
          year: data.year,
          workedDays: data.workedDays,
          netSalary: Number(data.netSalary || 0),
          extraPayment: Number(data.extraPayment || 0),
          advancePayment: Number(data.advancePayment || 0),
          totalPayment: Number(data.totalPayment || 0),
        },
      });
    },

    delete(id: number) {
      return prisma.payroll.delete({
        where: { id },
      });
    },
  },
};