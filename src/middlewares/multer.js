import fs from 'fs'
import moment from 'moment'
import multer from 'multer'

import * as logger from '../helpers/loggers/log4js'

/**
 * Multer Disk Storage
 */
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const directory = 'assets'
    if (!fs.existsSync(directory)) {
      fs.mkdir(directory, (err) => callback(err, directory))
    } else {
      callback(null, directory)
    }
  },
  filename: (request, file, callback) => {
    callback(null, getFilename(file))
  }
})

/**
 * Retrieve Filename
 * @param {File} file
 */
const getFilename = (file) => {
  return `${moment().unix()}-${file.originalname}`
}

/**
 * Upload Middleware
 */
const upload = multer({
  storage,
  fileFilter: (request, file, callback) => {
    logger.info({
      operation: 'Uploading File',
      filename: file.filename,
      filesize: file.size,
      mimetype: file.mimetype
    })
    callback(null, true)
  }
})

export default upload
