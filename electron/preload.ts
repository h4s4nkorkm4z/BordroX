import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("bordroxAPI", {
  personnel: {
  list: () => ipcRenderer.invoke("personnel:list"),
  create: (data: unknown) => ipcRenderer.invoke("personnel:create", data),
  update: (id: number, data: unknown) => ipcRenderer.invoke("personnel:update", id, data),
  delete: (id: number) => ipcRenderer.invoke("personnel:delete", id),
},
});