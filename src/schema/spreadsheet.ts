import moment from "moment-timezone";
import { z } from "zod";

export const spreadSheetDateFormat = "dddd, MMMM DD, YYYY";

const timeCellSchema = z
  .string()
  .regex(/^(1[0-2]|0?[1-9]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/);
const dateCellSchema = z.string().transform((dateString, ctx) => {
  const parsedDate = moment.utc(dateString, spreadSheetDateFormat);

  if (!parsedDate.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalidate date format",
    });

    return z.NEVER;
  }

  return parsedDate;
});

export const locations = {
  TrainMore: "TrainMore",
  Unlock: "Unlock",
  Other: "Other",
} as const;

export const isPaid = {
  Yes: "Yes",
  No: "No",
  "Without Coach": "Without Coach",
} as const;

const noteCell = z
  .string()
  .nullish()
  .transform((value) => {
    return value ?? null;
  });

export const rowSchema = z.union([
  z.tuple([
    dateCellSchema,
    z.nativeEnum(locations),
    z.nativeEnum(isPaid),
    z.string(),
  ]),
  z.tuple([
    dateCellSchema,
    z.nativeEnum(locations),
    z.nativeEnum(isPaid),
    z.string(),
    noteCell,
    timeCellSchema,
    timeCellSchema,
    z.coerce.string(),
  ]),
]);
export type Row = z.infer<typeof rowSchema>;

export const toRow = (row: {
  startedAt: moment.Moment;
  location: keyof typeof locations;
  isPaid: keyof typeof isPaid;
  title: string;
  note?: string;
  finishedAt?: moment.Moment;
}) => {
  return [
    row.startedAt.format(spreadSheetDateFormat),
    row.location,
    row.isPaid,
    row.title,
    row.note,
    row.startedAt.format("h:mm:ss A"),
    ...(row.finishedAt
      ? [
          row.finishedAt.format("h:mm:ss A"),
          row.finishedAt.diff(row.startedAt, "minutes"),
        ]
      : []),
  ];
};
