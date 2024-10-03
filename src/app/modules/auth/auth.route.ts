import requestValidationHandler from '../../middlewares/requestValidationHandler'
import { OtpController } from '../otp/otp.controller'
import { otpSchema } from '../otp/otp.validation'
import { AuthController } from './auth.controller'
import {
  user_login_zod_schema,
  user_refresh_token_zod_schema,
  user_signup_zod_schema,
} from './auth.validation'
import express from 'express'

const router = express.Router()

// SEND OTP ROUTE
router.post(
  '/send-otp',
  requestValidationHandler(otpSchema),
  OtpController.sendOtp
)
// SIGNUP ROUTE
router.post(
  '/signup',
  requestValidationHandler(user_signup_zod_schema),
  AuthController.signupUser
)
// SIGNIN ROUTE
router.post(
  '/login',
  requestValidationHandler(user_login_zod_schema),
  AuthController.loginUser
)
// REFRESH TOKEN ROUTE
router.post(
  '/refresh-token',
  requestValidationHandler(user_refresh_token_zod_schema),
  AuthController.refreshToken
)

export const AuthRoute = router
