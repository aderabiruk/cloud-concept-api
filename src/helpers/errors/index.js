import moment from 'moment'

import messages from '../i18next/en.json'

export class Error {
  constructor (statusCode, error) {
    this.statusCode = statusCode
    this.payload = {
      error,
      timestamp: moment()
    }
  }
}

export class BadRequestError extends Error {
  constructor (error) {
    super(400, error)
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super(401, messages.errors.general.unauthorized_error)
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super(403, messages.errors.general.forbidden_error)
  }
}

export class NotFoundError extends Error {
  constructor (error) {
    super(404, error)
  }
}

export class InternalServerError extends Error {
  constructor (error) {
    super(500, error || messages.errors.general.internal_server_error)
  }
}

export class ServiceUnavailableError extends Error {
  constructor (error) {
    super(502, error || messages.errors.general.service_unavailable)
  }
}
