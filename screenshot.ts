import { exec as execOg } from "child_process"
import { promisify } from "util"
const exec = promisify(execOg)

export default async ({ filename, region }) => {
  await exec(
    `scrot -o --autoselect ${Math.floor(region.x)},${Math.floor(
      region.y
    )},${Math.ceil(region.width)},${Math.ceil(region.height)} ${filename}`
  )
}
