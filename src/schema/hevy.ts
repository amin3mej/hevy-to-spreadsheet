import moment from "moment-timezone";
import { z } from "zod";

const dateSchema = z.string().transform((val) => {
  return moment(val);
});

export const workoutSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    start_time: dateSchema,
    end_time: dateSchema,
    updated_at: dateSchema,
    created_at: dateSchema,
  })
  .transform((workout) => {
    return {
      ...workout,
      startedAt: workout.start_time,
      finishedAt: workout.end_time,
      createdAt: workout.created_at,
      updatedAt: workout.updated_at,
    };
  });

export type Workout = z.infer<typeof workoutSchema>;

export const workoutsResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  workouts: workoutSchema.array(),
});
