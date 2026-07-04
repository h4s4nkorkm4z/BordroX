import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
const require$1 = createRequire(import.meta.url);
const { PrismaClient } = require$1("@prisma/client");
const prisma = new PrismaClient();
const database = {
  personnel: {
    list() {
      return prisma.personnel.findMany({
        orderBy: { createdAt: "desc" }
      });
    },
    create(data) {
      return prisma.personnel.create({
        data
      });
    },
    update(id, data) {
      return prisma.personnel.update({
        where: { id },
        data
      });
    },
    delete(id) {
      return prisma.personnel.delete({
        where: { id }
      });
    }
  }
};
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
ipcMain.handle("personnel:list", async () => {
  return database.personnel.list();
});
ipcMain.handle("personnel:create", async (_event, data) => {
  return database.personnel.create(data);
});
ipcMain.handle("personnel:delete", async (_event, id) => {
  return database.personnel.delete(id);
});
ipcMain.handle("personnel:update", async (_event, id, data) => {
  return database.personnel.update(id, data);
});
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1e3,
    minHeight: 700,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
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
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
