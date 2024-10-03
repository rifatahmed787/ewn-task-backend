import express from 'express'

const router = express.Router()

const all_routes: any[] = [
 
]

all_routes.map(item => router.use(item.path, item.router))

export default router
