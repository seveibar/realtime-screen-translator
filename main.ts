import electron from "electron"
import { getSentenceBlocksFromImage } from "./tesseract"
import screenshot from "screenshot-desktop"
import tempy from "tempy"
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

  const screenshotPath = tempy.file({ extension: "png" })
  console.log(screenshotPath)
  electron.ipcMain.on("get-blocks", async (event, arg) => {
    await screenshot({ filename: screenshotPath })
    const blocks = (await getSentenceBlocksFromImage(screenshotPath)).filter(
      (b) => {
        if (b.text.length <= 1) return false
        if (b.width < width / 20) return false
        return true
      }
    )
    console.log(blocks)
    event.reply("blocks", blocks)
  })
})
