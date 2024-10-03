import express, { Application } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

import cookieParser from 'cookie-parser'

const prisma = new PrismaClient()
const app: Application = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Start the server
async function main() {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

main()

//For the Graceful shutdown
process.on('SIGINT', () => {
  prisma.$disconnect()
  process.exit(0)
})
