import { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { IS_DEV } from '../config/constants'
import ApiError from './ApiError'

class ErrorHandler {
  private app: Application

  constructor(app: Application) {
    this.app = app
    this.app.use(this.catch404)
    this.app.use(this.errorConverter)
    this.app.use(this.makeErrorResponse)
  }

  catch404(req: Request, res: Response, next: NextFunction): void {
    next(new ApiError(404, 'Not found'))
  }

  errorConverter(err: ApiError | Error, req: Request, res: Response, next: NextFunction): void {
    let error = err
    if (err.name !== 'ApiError') {
      const msg = err.message || 'Internal server error'
      error = new ApiError(500, msg, err.stack)
      console.log(err)
    }
    next(error)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  makeErrorResponse(err: ApiError, req: Request, res: Response, _next: NextFunction): void {
    const { statusCode, message, errors } = err
    res.status(statusCode).json({
      meta: {
        code: statusCode,
        message,
        // @ts-expect-error
        status: httpStatus[statusCode],
      },
      data: {
        errors,
        ...(IS_DEV && err.stack ? { stack: err.stack } : {}),
      },
    })
  }
}

export default ErrorHandler
