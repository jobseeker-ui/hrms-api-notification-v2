import { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

class SuccessHandler {
  private app: Application

  constructor(app: Application) {
    this.app = app
    this.app.use(this.makeSuccessResponse)
  }

  makeSuccessResponse(req: Request, res: Response, next: NextFunction): void {
    res.success = (data: any, message?: string) => {
      res.status(httpStatus.OK).json({
        meta: {
          code: httpStatus.OK,
          message: message || httpStatus[httpStatus.OK],
          status: httpStatus[httpStatus.OK],
        },
        data,
      })
    }
    next()
  }
}

export default SuccessHandler
