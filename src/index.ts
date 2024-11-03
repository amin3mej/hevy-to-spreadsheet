import moment from "moment-timezone";

import { config } from "./config.ts";
import { fetchWorkouts } from "./hevy";
import { isPaid, locations, toRow } from "./schema/spreadsheet.ts";
import { appendRows, getLastRow } from "./spreadsheet";

moment.tz.setDefault(config.TIMEZONE);

const lastRow = await getLastRow();

const lastRowDate = lastRow[0];

let page = 1;
const rowsToAppend = [];

let shouldFetchNextPage = true;
do {
  const { workouts } = await fetchWorkouts(page++);

  const newWorkouts = workouts.filter((workout) => {
    return (
      workout.startedAt.isAfter(lastRowDate) &&
      !workout.startedAt.isSame(lastRowDate, "day")
    );
  });

  rowsToAppend.push(
    ...newWorkouts.map((workout) => {
      return toRow({
        location: locations.TrainMore,
        isPaid: isPaid.No,
        title: workout.title,
        startedAt: workout.startedAt,
        finishedAt: workout.finishedAt,
      });
    }),
  );

  shouldFetchNextPage = newWorkouts.length === workouts.length;
} while (shouldFetchNextPage);

await appendRows(rowsToAppend.reverse());
console.log(`Appended ${rowsToAppend.length} rows.`);
