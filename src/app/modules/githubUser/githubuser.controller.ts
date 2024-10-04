import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { pagination_keys } from '../../../constant/common';
import pick from '../../../shared/pick';
import { GithubUserService } from './githubuser.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// GET GITHUB USER CONTROLLER
const getGithubUsers = catchAsync(async (req: Request, res: Response) => {
  const pagination = pick(req.query, pagination_keys);
  
  // Ensure search is a string
  const search = (req.query.username as string) ?? "";

  // Fetch the user from the service
  const result = await GithubUserService.getGitHubUser(pagination, search);

  // Sending response
  sendResponse(res, {
    status_code: httpStatus.OK,
    success: true,
    data: result,
    message: 'Users retrieved successfully',
  });
});

export const GithubUserController = {
  getGithubUsers,
};
