import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("bordroxAPI", {
  personnel: {
    list: () => ipcRenderer.invoke("personnel:list"),
    create: (data: unknown) => ipcRenderer.invoke("personnel:create", data),
    delete: (id: number) => ipcRenderer.invoke("personnel:delete", id),
  },
});