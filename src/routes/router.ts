import express from 'express'
import { AuthRoute } from '../app/modules/auth/auth.route'
import { UserRoute } from '../app/modules/user/user.route'

const router = express.Router()

const all_routes = [
  { path: '/auth', router: AuthRoute },
  { path: '/user', router: UserRoute },
]

// MAPPING ALL THE ROUTE
all_routes.map(item => router.use(item.path, item.router))

export default router
