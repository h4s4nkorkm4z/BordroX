"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("bordroxAPI", {
  personnel: {
    list: () => electron.ipcRenderer.invoke("personnel:list"),
    create: (data) => electron.ipcRenderer.invoke("personnel:create", data),
    delete: (id) => electron.ipcRenderer.invoke("personnel:delete", id)
  }
});
