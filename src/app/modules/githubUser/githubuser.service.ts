import axios from 'axios'
import { Prisma, PrismaClient } from '@prisma/client'
import { pagination_map } from '../../../helpers/pagination'
import { IPagination } from '../../../interfaces/pagination'

const prisma = new PrismaClient()

// Function to fetch GitHub user by username from GitHub API
const fetchGitHubUserFromApi = async (username: string) => {
  try {
    const { data } = await axios.get(`https://api.github.com/users/${username}`)
    return {
      username: data.login,
      avatarUrl: data.avatar_url,
      name: data.name,
      location: data.location,
      bio: data.bio,
      githubId: data.id,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`GitHub API Error: ${error.response?.data.message || 'Failed to fetch user'}`)
    }
    throw new Error('Failed to fetch GitHub user from API')
  }
}

// Function to get GitHub user with pagination and search
const getGitHubUser = async (
  pagination_data: Partial<IPagination>,
  search: string
) => {
  const { page, limit, skip, sortObject } = pagination_map(pagination_data)

  // Dynamic search condition based on the search input
  const whereCondition: Prisma.GitHubUserWhereInput = {
    username: { contains: search, mode: Prisma.QueryMode.insensitive }
  }

  // Check if user exists in DB by username
  let user = await prisma.gitHubUser.findFirst({
    where: whereCondition,
  })

  // If user does not exist in DB, fetch from GitHub API
  if (!user) {
    try {
      const githubUser = await fetchGitHubUserFromApi(search)

      // Save fetched user to DB
      user = await prisma.gitHubUser.create({
        data: githubUser,
      })
    } catch (error) {
      throw new Error('Failed to fetch and save GitHub user')
    }
  }

  // Paginate results from DB
  const total = await prisma.gitHubUser.count({
    where: whereCondition,
  })

  const users = await prisma.gitHubUser.findMany({
    where: whereCondition,
    orderBy: sortObject || { id: 'asc' },
    skip,
    take: limit,
  })

  // Return paginated data
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: users,
  }
}

export const GithubUserService={
    getGitHubUser
}