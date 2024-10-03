import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserServices } from './user.service'

//  GET USER PROFILE CONTROLLER
const userProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.logged_in_user?.id
  const result = await UserServices.my_profile(userId)

  sendResponse(res, {
    status_code: httpStatus.OK,
    success: true,
    data: result,
    message: "User's information retrieved successfully",
  })
})

export const UserController = {
  userProfile,
}
