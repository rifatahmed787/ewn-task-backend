import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { pagination_keys } from '../../../constant/common'
import pick from '../../../shared/pick'
import { GithubUserService } from './githubuser.service'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'

// GET GITHUB USER CONTROLLER
const getGithubUsers = catchAsync(async (req: Request, res: Response) => {
  const pagination = pick(req.query, pagination_keys)
  const search = req.query.search?.toString() || ''
  const result = await GithubUserService.getGitHubUser(pagination, search)

  // Sending response
  sendResponse(res, {
    status_code: httpStatus.OK,
    success: true,
    data: result,
    message: 'Users retrieved successfully',
  })
})

export const GithubUserController = {
  getGithubUsers,
}
