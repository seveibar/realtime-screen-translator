import electron from "electron"
console.log("electron", electron)
const { app, BrowserWindow, screen } = electron

let mainWindow
app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadFile("./index.html")
  mainWindow.setIgnoreMouseEvents(true, { forward: true })
})
