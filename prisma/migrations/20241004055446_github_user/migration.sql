-- CreateTable
CREATE TABLE "GitHubUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "bio" TEXT,
    "githubId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubUser_username_key" ON "GitHubUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubUser_githubId_key" ON "GitHubUser"("githubId");
