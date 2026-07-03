/// <reference types="vite/client" />

import type { Personnel } from "./types/personnel";

declare global {
  interface Window {
    bordroxAPI: {
      personnel: {
        list: () => Promise<Personnel[]>;
        create: (data: {
          name: string;
          position: string;
          phone?: string;
          email?: string;
          nationalId?: string;
          iban?: string;
          hireDate?: string;
          notes?: string;
          salary: number;
        }) => Promise<Personnel>;
        update: (
          id: number,
          data: {
            name: string;
            position: string;
            phone?: string;
            salary: number;
          }
        ) => Promise<Personnel>;
        delete: (id: number) => Promise<Personnel>;
      };
    };
  }
}

export {};import type { Personnel } from "./types/personnel";

declare global {
  interface Window {
    bordroxAPI: {
      personnel: {
        list: () => Promise<Personnel[]>;
        create: (data: {
          name: string;
          position: string;
          phone?: string;
          salary: number;
        }) => Promise<Personnel>;
        delete: (id: number) => Promise<Personnel>;
      };
    };
  }
}