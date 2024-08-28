import Joi from 'joi'

class ApiError extends Error {
  statusCode: number
  errors?: { [key: string]: string[] }

  constructor(statusCode: number, error?: string | Joi.ValidationError | Error, stack?: string) {
    if (typeof error === 'string') {
      super(error)
    } else if (error instanceof Joi.ValidationError) {
      super(error.message)
      this.formatJoiValidationError(error)
    } else if (error instanceof Error) {
      super(error.message)
    } else {
      super()
    }
    this.statusCode = statusCode
    this.stack = stack || this.stack
    this.name = 'ApiError'
  }

  formatJoiValidationError(e: Joi.ValidationError) {
    this.message = this.message || e.message
    const errors: { [key: string]: string[] } = {}

    for (const detail of e.details) {
      const key = detail.context?.key
      if (key) {
        errors[key] = errors[key] || []
        errors[key].push(detail.message)
      }
    }

    if (Object.keys(errors).length > 0) {
      this.errors = errors
    }
  }
}

export default ApiError
