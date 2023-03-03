import fs from 'fs'
import axios from 'axios'
import https from 'https'
import { reject } from 'async'

export default {
  downloadFile
}

function downloadFile(url, output) {
  return new Promise((resolve) => {
    console.log('[Downloading]', url)
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(output)
      res.pipe(fileStream)
  
      fileStream.on("close", () => {
        resolve(true)
      })
      fileStream.on('error', e => {
        console.log(e)
        reject(e)
      })
    })
  })
}
