import { z } from "zod";

export const workoutSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
});

export type Workout = z.infer<typeof workoutSchema>;

export const workoutsResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  workouts: workoutSchema.array(),
});
