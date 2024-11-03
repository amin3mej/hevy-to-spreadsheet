import { config } from "../config.ts";
import { workoutsResponseSchema } from "../schema/hevy.ts";

export const fetchWorkouts = async (page = 1) => {
  const response = await fetch(
    config.HEVY_BASE_URL + "/workouts?page=" + page + "&pageSize=10",
    {
      headers: {
        "api-key": config.HEVY_API_KEY,
      },
    },
  );
  const workoutsResponse = await response.json();

  if (!response.ok) {
    throw new Error(workoutsResponse.message);
  }

  return workoutsResponseSchema.parse(workoutsResponse);
};
