import z from "zod";

const envSchema = z.object({
  HEVY_BASE_URL: z.string().url(),
  HEVY_API_KEY: z.string().trim().min(1),
  SPREADSHEET_ID: z.string().trim().min(1),
  SPREADSHEET_SHEET_NAME: z.string().trim().min(1),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().trim().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  TIMEZONE: z.string().default("Europe/Amsterdam"),
});

const parsedEnv = envSchema.safeParse({
  HEVY_BASE_URL: process.env.HEVY_BASE_URL,
  HEVY_API_KEY: process.env.HEVY_API_KEY,
  SPREADSHEET_ID: process.env.SPREADSHEET_ID,
  SPREADSHEET_SHEET_NAME: process.env.SPREADSHEET_SHEET_NAME,
  GOOGLE_APPLICATION_CREDENTIALS: process.env["GOOGLE_APPLICATION_CREDENTIALS"],
  NODE_ENV: process.env.NODE_ENV,
  TIMEZONE: process.env.TIMEZONE,
});

if (!parsedEnv.success) {
  console.error(parsedEnv.error.issues);
  throw new Error("There is an error with the server environment variables");
}

export const config = parsedEnv.data;
