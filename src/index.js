import app from './app'
import config from './config'
import * as logger from './helpers/loggers/log4js'

const PORT = process.env.PORT || config.PORT

app.listen(PORT, () => {
  logger.info(`${config.API_NAME} Running on port ${PORT}`)
})

process.on('uncaughtException', (error) => {
  logger.fatal({ uncaughtException: error })
})

process.on('unhandledRejection', function (error) {
  logger.fatal({ unhandledRejection: error })
})

export default app
