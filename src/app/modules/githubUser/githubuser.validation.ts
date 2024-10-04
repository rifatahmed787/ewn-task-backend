import { z } from 'zod';

export const githubUserSchema = z.object({
  id: z.number().int().optional(),
  username: z.string().min(1, "Username is required"),
  avatarUrl: z.string().url("Invalid avatar URL"),
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  bio: z.string().optional(),      
  githubId: z.number().int(),
});
