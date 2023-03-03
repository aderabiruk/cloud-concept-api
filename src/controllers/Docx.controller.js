import fs from 'fs'
import path from 'path'
import evalidate from 'evalidate'

import config from '../config'
import AwsHelper from '../helpers/utils/s3'
import { Settings } from '../models/Settings'
import messages from '../helpers/i18next/en.json'
import DownloadHelper from '../helpers/utils/download'
import DocxGenerator from '../services/DocxGenerator'
import { BadRequestError, InternalServerError, NotFoundError } from '../helpers/errors'

async function generate (req, res, next) {
  try {
    let schema = new evalidate.schema({
      accountId: evalidate.string().required(),
      email: evalidate.string().email().required()
    });
    const result = schema.validate(req.body)
    if (!result.isValid) {
      return next(new BadRequestError(result.errors[0].message || messages.errors.general.internal_server_error))
    }

    const { email, accountId, boards } = req.body
    const settings = await Settings.findOne({ accountId })
    if (!settings) {
      return next(new NotFoundError(messages.errors.settings.template_not_found))
    }

    // Download Template DocX
    const output = `./assets/${decodeURI(path.basename(settings.templatePath))}`;
    await DownloadHelper.downloadFile(settings.templatePath, output)
   
    if (boards?.length === 0) {
      return next(new NotFoundError(messages.errors.settings.invalid_document_uploaded))
    }

    // Start background process
    const [board] = boards
    DocxGenerator.start(email, output, board)

    return res.json(settings)
  } catch (error) {
    console.log({
      tag: 'Generate Docx',
      error
    })
    next(error)
  }
}

async function uploadTemplate (req, res, next) {
  try {
    let schema = new evalidate.schema({
      accountId: evalidate.string().required()
    });
    const result = schema.validate(req.body)
    if (!result.isValid) {
      return next(new BadRequestError(result.errors[0].message || messages.errors.general.internal_server_error))
    }
    const stream = fs.createReadStream(req.file.path)
    stream.on('error', (error) => {
      return next(new InternalServerError(error.message))
    })

    const key = req.file.filename
    const response = await AwsHelper.upload(
      config.AWS_BUCKET,
      key,
      stream
    )

    const accountId = req.body.accountId
    let settings = await Settings.findOne({ accountId })
    if (!settings) {
      settings = await Settings.create({
        accountId,
        templatePath: response.Location
      })
    }
    settings.templatePath = response.Location
    await settings.save()

    fs.unlinkSync(req.file.path)
    return res.json(settings)
  } catch (error) {
    console.log({
      tag: 'Upload Docx',
      error
    })
    next(error)
  }
}

export default {
  generate,
  uploadTemplate
}
