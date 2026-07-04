import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

type PersonnelData = {
  name: string;
  position: string;
  phone?: string;
  salary: number;
};

export const database = {
  personnel: {
    list() {
      return prisma.personnel.findMany({
        orderBy: { createdAt: "desc" },
      });
    },

    create(data: PersonnelData) {
      return prisma.personnel.create({
        data,
      });
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
};