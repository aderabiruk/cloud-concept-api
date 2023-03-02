import fs from 'fs'
import evalidate from 'evalidate'

import config from '../config'
import AwsHelper from '../helpers/aws/s3'
import { Settings } from '../models/Settings'
import messages from '../helpers/i18next/en.json'
import { BadRequestError, InternalServerError, NotFoundError } from '../helpers/errors'

async function generate (req, res, next) {
  try {
    let schema = new evalidate.schema({
      accountId: evalidate.string().required()
    });
    const result = schema.validate(req.body)
    if (!result.isValid) {
      return next(new BadRequestError(result.errors[0].message || messages.errors.general.internal_server_error))
    }

    const accountId = req.body.accountId
    const settings = await Settings.findOne({ accountId })
    if (!settings) {
      return next(new NotFoundError(messages.errors.settings.template_not_found))
    }
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
