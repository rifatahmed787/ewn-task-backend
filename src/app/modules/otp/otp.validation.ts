import { z } from 'zod';

export const otpSchema = z.object({ 
  otp: z.string().min(1, "OTP is required"), 
  expiration: z.date(), 
  userIdentifier: z.string().min(1, "User identifier is required")
});
