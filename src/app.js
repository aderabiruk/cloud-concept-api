import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'
import moment from 'moment'
import express from 'express'
import compression from 'compression'

import config from './config'
import routes from './routers'
import { Error } from './helpers/errors'
import messages from './helpers/i18next/en.json'
import * as logger from './helpers/loggers/log4js'
import initializeDb from './helpers/database/mongoose'

// Initialize Express
const app = express()

// Middlewares
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({ contentSecurityPolicy: false }))
app.use(morgan('combined'))
app.use(cors())
app.use(express.static(path.join(__dirname, '../')))

// Initialize MongoDb
initializeDb()

// Initialize Routes
routes(app)

// Api Endpoint
app.get('/', async (req, res) => {
  res.json({
    port: config.PORT,
    locale: config.LOCALE,
    name: config.API_NAME
  })
})

// Health Endpoint
app.get('/health', async (req, res) => {
  res.json({
    status: 'healthy'
  })
})

// Global Error Handler
app.use((error, request, response, next) => {
  logger.fatal(error)
  if (error instanceof Error) {
    response.status(error.statusCode).json(error.payload)
  } else {
    response.status(500).json({
      timestamp: moment(),
      errors: [messages.errors.general.internal_server_error]
    })
  }
})

export default app
