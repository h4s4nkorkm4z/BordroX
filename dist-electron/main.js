import { ipcMain as i, app as s, BrowserWindow as p } from "electron";
import { fileURLToPath as _ } from "node:url";
import n from "node:path";
import { createRequire as h } from "node:module";
const R = h(import.meta.url), { PrismaClient: w } = R("@prisma/client"), t = new w(), l = {
  personnel: {
    list() {
      return t.personnel.findMany({
        orderBy: { createdAt: "desc" }
      });
    },
    create(e) {
      return t.personnel.create({ data: e });
    },
    update(e, r) {
      return t.personnel.update({
        where: { id: e },
        data: r
      });
    },
    delete(e) {
      return t.personnel.delete({
        where: { id: e }
      });
    }
  }
}, c = n.dirname(_(import.meta.url));
process.env.APP_ROOT = n.join(c, "..");
const a = process.env.VITE_DEV_SERVER_URL, I = n.join(process.env.APP_ROOT, "dist-electron"), d = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = a ? n.join(process.env.APP_ROOT, "public") : d;
let o;
i.handle("personnel:list", async () => l.personnel.list());
i.handle("personnel:create", async (e, r) => l.personnel.create(r));
i.handle("personnel:update", async (e, r, u) => l.personnel.update(r, u));
i.handle("personnel:delete", async (e, r) => l.personnel.delete(r));
function m() {
  o = new p({
    width: 1200,
    height: 800,
    minWidth: 1e3,
    minHeight: 700,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: n.join(c, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), a ? o.loadURL(a) : o.loadFile(n.join(d, "index.html"));
}
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), o = null);
});
s.on("activate", () => {
  p.getAllWindows().length === 0 && m();
});
s.whenReady().then(m);
export {
  I as MAIN_DIST,
  d as RENDERER_DIST,
  a as VITE_DEV_SERVER_URL
};
