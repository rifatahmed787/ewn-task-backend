
import { ZodError, ZodIssue } from 'zod'
import { generic_error_type, modified_error_res_type } from '../../interfaces/error'

const HandleZodValidationError = (error: ZodError): modified_error_res_type => {
  const all_errors: generic_error_type[] = error.issues.map((el: ZodIssue) => {
    return { path: el?.path[el?.path?.length - 1], message: el?.message }
  })
  
  return {
    status_code: 400,
    message: 'Validation error;Some values are missing or incorrect',
    errorMessages: all_errors,
  }
}

export default HandleZodValidationError
