import { jwtHelper } from '../../../helpers/jwtHelper'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { IUserLoginResponse, UserWithResponse } from './auth.interface'
const prisma = new PrismaClient()

// USER SIGNUP FUNCTION
const user_signup = async (user_data: User): Promise<UserWithResponse> => {
  // Checking if the pass is belongs to user data
  if (!user_data.password) {
    throw new Error('Password is required')
  }

  //Hashing password
  const hashedPassword = await bcrypt.hash(user_data.password, 10)

  // Avatar set
  const avatar =
    user_data.avatar ||
    'https://res.cloudinary.com/dztlowlu0/image/upload/v1700031261/avatar_ylo9mt.png'

  // create user
  const created_user = await prisma.user.create({
    data: {
      username: user_data.username,
      email: user_data.email,
      password: hashedPassword,
      avatar: avatar,
      language: user_data.language,
      verified: true,
    },
  })

  //   User without password
  const userWithoutPassword: Partial<User> = {
    id: created_user.id,
    username: created_user.username,
    email: created_user.email,
    language: created_user.language,
    avatar: created_user.avatar,
    verified:created_user.verified
  }

  // delete password
  delete userWithoutPassword.password

  // token without password
  const accessToken = jwtHelper.create_token(
    {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expiresIn as string
  )

  const refreshToken = jwtHelper.create_token(
    {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expiresIn as string
  )

  return {
    user_details: created_user,
    accessToken,
    refreshToken,
  }
}

// USER LOGIN FUNCTION
const user_login = async (
  email: string,
  password: string
): Promise<IUserLoginResponse | null> => {

  // Function to check if a user with a given email
  const isUserExist = async (identifier: string): Promise<User | null> => {
    return prisma.user.findFirst({
      where: {
        email: identifier,
      },
    })
  }

  const user = await isUserExist(email)

  //   Given error if user not exist
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
  }

  // Validate password
  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User has no password set')
  }

  // Function to compare a given password with the stored hashed password
  const isPasswordMatched = async (
    encrypted_pass: string,
    given_pass: string
  ): Promise<boolean> => {
    return bcrypt.compare(given_pass, encrypted_pass)
  }

  // Match password
  if (!(await isPasswordMatched(user.password, password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid password')
  }

  // Ensuring email is not null when generating the token
  const emailForToken = user.email ? user.email : ''
  
  // Create an access token
  const accessToken = jwtHelper.create_token(
    {
      id: user.id,
      email: emailForToken,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expiresIn as string
  )

  // Create a refresh token
  const refreshToken = jwtHelper.create_token(
    { id: user.id, email: emailForToken },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expiresIn as string
  )


  // Return the response
  return {
    accessToken,
    refreshToken,
    user_details: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      language:user.language,
      verified:user.verified
    },
  }
}

// refresh_token
const refresh_token = async (
  token: string
): Promise<IUserLoginResponse | null> => {
  //  token verification
  let decoded_token = null
  try {
    decoded_token = jwtHelper.verify_token(
      token,
      config.jwt.refresh_token_secret as Secret
    )
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
  }
  const { id, email } = decoded_token

  // user checking verification
  const isUserExist = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  const user = await isUserExist(email)

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
  }

  // access token
  const accessToken = jwtHelper.create_token(
    { id, email },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expiresIn as string
  )
  // refresh token
  const refreshToken = jwtHelper.create_token(
    { id, email },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expiresIn as string
  )

  return { accessToken, refreshToken, user_details: user }
}

export const AuthServices = {
  user_signup,
  user_login,
  refresh_token,
}
