import mongoose from 'mongoose'
import config from '../../config'
import * as logger from '../loggers/log4js'

export default () => {
  const dbUrl = config.DB_URL

  mongoose.connect(dbUrl)
  mongoose.connection.on('connected', () => {
    logger.info(`Database connection established with ${dbUrl}`)
  })

  mongoose.connection.on('error', (error) => {
    logger.info(`Database connection error: ${error}`)
  })

  mongoose.connection.on('disconnected', () => {
    logger.info('Database connection terminated.')
  })
}
