/// <reference types="vite/client" />

import type { Personnel } from "./types/personnel";

type PersonnelFormData = {
  name: string;
  position: string;
  phone?: string;
  salary: number;
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
    };
  }
}

export {};