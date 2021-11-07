import { exec } from "child_process"
import tempy from "tempy"
import Papa from "papaparse"
import fs from "fs/promises"
import translate from "./translate"
import convertHanziToPinyin from "hanzi-to-pinyin"

type RChar = {
  level: string
  page_num: string
  block_num: number
  par_num: string
  line_num: string
  word_num: number
  left: number
  top: number
  width: number
  height: number
  conf: string
  text: string
}

type Block = {
  text: string
  left: number
  top: number
  width: number
  height: number
  pinyin?: string
  translation: string
  chars: Array<RChar>
}

export async function tesseract(inputFilePath, opts) {
  const outputFilePath = tempy.file({ extension: "tsv" })
  await new Promise((resolve, reject) => {
    exec(
      `tesseract --psm 12 --oem 2 -l chi_tra ${inputFilePath} ${outputFilePath.replace(
        /\.tsv$/,
        ""
      )} tsv`,
      (err, stdout, stderr) => {
        if (err) reject(err)
        resolve(null)
      }
    )
  })

  const recognizedChars: Array<RChar> = Papa.parse(
    (await fs.readFile(outputFilePath)).toString(),
    {
      header: true,
    }
  ).data.map((a) => ({
    ...a,
    block_num: parseInt(a.block_num),
    left: parseInt(a.left),
    top: parseInt(a.top),
    width: parseInt(a.width),
    height: parseInt(a.height),
  }))

  // generate lines based on recognized characters
  let blockMap: {
    [block_num: string]: Block
  } = {}
  for (const c of recognizedChars) {
    if (!blockMap[c.block_num])
      blockMap[c.block_num] = {
        text: "",
        chars: [],
      } as any
  }
  for (const c of recognizedChars) {
    if (!c.level) continue
    if (!(c.text || "").trim()) continue
    if (opts.charFilter && !opts.charFilter(c.text)) continue
    const block = blockMap[c.block_num]
    block.text += c.text
    block.chars.push(c)
  }

  const blocks = Object.values(blockMap)
    .filter((b: any) => b.text)
    .map((b) => ({
      ...b,
      left: Math.min(...b.chars.map((c) => c.left)),
      top: Math.min(...b.chars.map((c) => c.top)),
    }))
    .map((b) => ({
      ...b,
      width: Math.max(...b.chars.map((c) => c.left + c.width)) - b.left,
      height: Math.max(...b.chars.map((c) => c.top + c.height)) - b.top,
    }))

  return { chars: recognizedChars, blocks }
}

export async function getSentenceBlocksFromImage(imageFilePath) {
  const { blocks } = await tesseract(imageFilePath, {
    charFilter: (c) => /\p{sc=Han}/u.test(c),
  })
  const translationResult = (
    await translate(blocks.map((b) => b.text).join("."), {
      to: "en",
    })
  ).split(".")

  blocks.forEach((b, i) => {
    b.translation = translationResult[i]
  })

  for (const b of blocks) {
    b.pinyin = (await convertHanziToPinyin(b.text, { segmented: true })).join(
      "  "
    )
  }

  return blocks
}

if (!module.parent) {
  ;(async () => {
    const blocks = await getSentenceBlocksFromImage("./example-image.png")
    console.table(
      blocks.map((b) => ({
        text: b.text,
        "x,y": [b.left, b.top],
        pinyin: b.pinyin,
        translation: b.translation,
      }))
    )
  })()
}
