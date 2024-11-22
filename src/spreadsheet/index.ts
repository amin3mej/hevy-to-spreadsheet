import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

import { config } from "../config.ts";
import { rowSchema, toRow } from "../schema/spreadsheet.ts";

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

const getSheet = async () => {
  const auth = new GoogleAuth({
    scopes,
  });
  return google.sheets({ version: "v4", auth }).spreadsheets;
};

export const getLastRow = async () => {
  const sheet = await getSheet();
  const result = await sheet.values.get({
    spreadsheetId: config.SPREADSHEET_ID,
    range: config.SPREADSHEET_SHEET_NAME,
  });

  const row = result.data.values?.[result.data.values?.length - 1];
  return rowSchema.parse(row);
};

export const appendRows = async (rows: ReturnType<typeof toRow>[]) => {
  const sheet = await getSheet();
  await sheet.values.append({
    spreadsheetId: config.SPREADSHEET_ID,
    range: config.SPREADSHEET_SHEET_NAME,
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });
};
