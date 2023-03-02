import log4js from 'log4js'

const logger = log4js.getLogger()
logger.level = 'debug'

const isJSON = (payload) => {
  try {
    return JSON.parse(payload) && !!payload
  } catch (e) {
    return false
  }
}

function formatLog (log) {
  return isJSON(log) ? JSON.parse(log) : log
}

export function debug (log) {
  logger.debug(formatLog(log))
}

export function fatal (log) {
  logger.fatal(formatLog(log))
}

export function info (log) {
  logger.info(formatLog(log))
}

export function warn (log) {
  logger.warn(formatLog(log))
}
