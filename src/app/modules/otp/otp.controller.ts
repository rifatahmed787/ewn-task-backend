import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { OtpService } from './otp.service'

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body
  const userIdentifier = email
  const result = await OtpService.generateOTP(userIdentifier)

  sendResponse(res, {
    status_code: httpStatus.OK,
    success: true,
    data: result,
    message: 'OTP generated successfully',
  })
})

export const OtpController = {
  sendOtp,
}
