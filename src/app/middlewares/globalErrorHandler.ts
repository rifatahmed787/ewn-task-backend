/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, Request, Response } from 'express'
import { generic_error_type } from '../../interfaces/error'
import { handleValidationError } from '../errors/HandleValidationError'
import ApiError from '../errors/ApiError'
import { ZodError } from 'zod'
import HandleZodValidationError from '../errors/HandleZodValidationError'

const global_error_handler: ErrorRequestHandler = async (
  error,
  req: Request,
  res: Response,
  next
) => {
  let status_code = 500
  let message = 'Something went wrong'
  let errorMessages: generic_error_type[] = []

  if (error?.name === 'ValidationError') {
    const validation_error = handleValidationError(error)
    status_code = validation_error.status_code
    message = validation_error.message
    errorMessages = validation_error.errorMessages
  } else if (error instanceof ZodError) {
    const z_validation_error = HandleZodValidationError(error)
    status_code = z_validation_error.status_code
    message = z_validation_error.message
    errorMessages = z_validation_error.errorMessages
  } else if (error instanceof ApiError) {
    status_code = error.statusCode
    message = 'Api Connection error'
    errorMessages = error.message ? [{ path: '', message: error.message }] : []
  } else if (error instanceof Error) {
    message = 'Internal error'
    errorMessages = error.message ? [{ path: '', message: error.message }] : []
  }

  res.status(status_code).json({
    success: false,
    message,
    errorMessages,
    stack: error?.stack, //config?.node_env === 'development' ? error?.stack : undefined,
  })
}
export default global_error_handler
