import { config } from "dotenv";
config();

const { UPLOADS_BASE_URL } = process.env;

export const urls = {
  publicUploads: (fileName: string) => `${UPLOADS_BASE_URL}/${fileName}`,
  openMeteoApi: (lat: number, lon: number) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true&timezone=auto`,
};
