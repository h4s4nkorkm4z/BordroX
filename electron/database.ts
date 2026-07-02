import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const database = {
  personnel: {
    list() {
      return prisma.personnel.findMany({
        orderBy: { createdAt: "desc" },
      });
    },

    create(data: {
      name: string;
      position: string;
      phone?: string;
      salary: number;
    }) {
      return prisma.personnel.create({
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