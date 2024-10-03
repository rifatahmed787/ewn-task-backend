import { OtpService } from './../otp/otp.service'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import catchAsync from '../../../shared/catchAsync'
import { Request, Response } from 'express'

import { User } from '@prisma/client'
import { AuthServices } from './auth.service'
import { IUserLoginResponse } from './auth.interface'

// SIGNUP USER CONTROLLER
const signupUser = catchAsync(async (req: Request, res: Response) => {
  const { otp, ...user_data } = req.body
  const userIdentifier = user_data?.email

  // Verify the OTP first
  const otpVerificationResult = await OtpService.verifyOTP(userIdentifier, otp)

  // If OTP verification fails, send an error response
  if (!otpVerificationResult.success) {
    return sendResponse<null, null>(res, {
      status_code: httpStatus.BAD_REQUEST,
      success: false,
      data: null,
      message: otpVerificationResult.message,
    })
  }

  // send the user data to auth service
  const result = await AuthServices.user_signup(user_data)

  const accessToken = result?.accessToken as string
  const refreshToken = result?.refreshToken as string
  const user_details = result?.user_details as Partial<User>

  // cookies options
  const options = {
    httpOnly: true,
    secure: false,
  }

  res.cookie('refreshToken', refreshToken, options)

  sendResponse<IUserLoginResponse, null>(res, {
    status_code: httpStatus.OK,
    success: true,
    data: { accessToken, user_details },
    message: 'User signed up successfully',
  })
})

// LOGIN USER CONTROLLER
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body

// Pass the email and password to auth service
  const result = await AuthServices.user_login(email, password)

  const accessToken = result?.accessToken as string
  const refreshToken = result?.refreshToken as string
  const user_details = result?.user_details as Partial<User>

  // cookies options
  const options = {
    httpOnly: true,
    secure: false,
  }

  res.cookie('refreshToken', refreshToken, options)

  sendResponse<IUserLoginResponse, null>(res, {
    status_code: httpStatus.OK,
    success: true,
    data: { accessToken, user_details },
    message: 'User logged in successfully',
  })
})

// REFRESH TOKEN
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refresh_token(refreshToken)

  const accessToken = result?.accessToken as string
  const newRefreshToken = result?.refreshToken as string
  const user_details = result?.user_details as Partial<User>

  // cookies options
  const options = {
    httpOnly: true,
    secure: false,
  }

  res.cookie('refreshToken', newRefreshToken, options)

  sendResponse<IUserLoginResponse, null>(res, {
    status_code: httpStatus.OK,
    success: true,
    data: { accessToken, user_details },
    message: 'New access token generated successfully !',
  })
})

export const AuthController = {
  signupUser,
  loginUser,
  refreshToken,
}
