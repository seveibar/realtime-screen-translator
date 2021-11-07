import { ipcRenderer } from "electron"
import React from "react"
import ReactDOM from "react-dom"

const Screen = ({ blocks, avgResponseTime }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {blocks.map((block, i) => (
        <div
          style={{
            color: "red",
            fontSize: 24,
            left: block.left,
            top: block.top,
            textShadow: "0px 0px 4px black",
            position: "absolute",
          }}
          key={i}
        >
          <div>{block.pinyin}</div>
          <div>{block.translation}</div>
        </div>
      ))}
      <div
        style={{ position: "absolute", right: 64, bottom: 64, color: "red" }}
      >
        Avg Translation Speed: {(avgResponseTime / 1000).toFixed(2)}s
      </div>
    </div>
  )
}

let avgResponseTime = 0
let lastSendTime = Date.now()

ipcRenderer.on("blocks", (e, blocks) => {
  console.log(blocks)
  avgResponseTime = (avgResponseTime * 9 + Date.now() - lastSendTime) / 10
  ReactDOM.render(
    <Screen blocks={blocks} avgResponseTime={avgResponseTime} />,
    document.getElementById("root")
  )
  lastSendTime = Date.now()
  ipcRenderer.send("get-blocks")
})

ipcRenderer.send("get-blocks")
