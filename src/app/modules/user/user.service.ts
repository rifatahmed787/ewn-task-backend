import httpStatus from 'http-status'
import ApiError from '../../errors/ApiError'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()


// GET USER PROFILE
const my_profile = async (userId: string): Promise<Partial<User> | null> => {
  // Find unique user by id
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      language: true,
      verified: true,
    },
  })

  // Error if no user found
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  // Return user profile.
  return user
}

export const UserServices = {
  my_profile,
}
