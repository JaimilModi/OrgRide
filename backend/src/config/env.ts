import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM (TypeScript with NodeNext uses ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the backend workspace directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL environment variable is required',
  }).url('DATABASE_URL must be a valid PostgreSQL connection URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET environment variable is required',
  }),
  JWT_EXPIRES_IN: z.string().default('24h'),
  CLOUDINARY_CLOUD_NAME: z.string({
    required_error: 'CLOUDINARY_CLOUD_NAME environment variable is required',
  }),
  CLOUDINARY_API_KEY: z.string({
    required_error: 'CLOUDINARY_API_KEY environment variable is required',
  }),
  CLOUDINARY_API_SECRET: z.string({
    required_error: 'CLOUDINARY_API_SECRET environment variable is required',
  }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
