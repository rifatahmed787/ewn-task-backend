import express from 'express'
import { GithubUserController } from './githubuser.controller'

const router = express.Router()

router.get('/github-user', GithubUserController.getGithubUsers)

export const GithubUserRoute = router
