declare module "bun" {
  interface Env {
    HEVY_BASE_URL: string;
    HEVY_API_KEY: string;
    SPREADSHEET_ID: string;
    SPREADSHEET_SHEET_NAME: string;
    GOOGLE_APIS_CREDENTIALS_PATH: string;
    TIMEZONE?: string;
  }
}
