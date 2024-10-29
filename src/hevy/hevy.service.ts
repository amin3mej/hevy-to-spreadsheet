import { workoutsResponseSchema } from "./schema.ts";
import { hevyConfigService } from "./hevy-config.service.ts";

export const fetchWorkouts = async (page = 1) => {
  const response = await fetch(
    hevyConfigService.baseUrl + "/workouts?page=" + page + "&pageSize=10",
    {
      headers: {
        "api-key": hevyConfigService.apiKey,
      },
    },
  );
  const workoutsResponse = await response.json();

  if (!response.ok) {
    throw new Error(workoutsResponse.message);
  }
  console.log({ workoutsResponse });

  return workoutsResponseSchema.parse(workoutsResponse);
};
