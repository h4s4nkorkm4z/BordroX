import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("bordroxAPI", {
  personnel: {
    list: () => ipcRenderer.invoke("personnel:list"),
    create: (data: unknown) => ipcRenderer.invoke("personnel:create", data),
    update: (id: number, data: unknown) =>
      ipcRenderer.invoke("personnel:update", id, data),
    delete: (id: number) => ipcRenderer.invoke("personnel:delete", id),
  },
});import { createRequire } from "node:module";

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
};/// <reference types="vite/client" />

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

export {};import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { database } from "./database";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

ipcMain.handle("personnel:list", async () => {
  return database.personnel.list();
});

ipcMain.handle("personnel:create", async (_event, data) => {
  return database.personnel.create(data);
});

ipcMain.handle("personnel:update", async (_event, id: number, data) => {
  return database.personnel.update(id, data);
});

ipcMain.handle("personnel:delete", async (_event, id: number) => {
  return database.personnel.delete(id);
});

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);