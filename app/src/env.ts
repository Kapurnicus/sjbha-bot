import * as dotenv from "dotenv";
dotenv.config()

export default <const>{
  HOSTNAME: required(process.env.HOSTNAME),
  HTTP_PORT: required(process.env.HTTP_PORT),
  DISCORD_TOKEN: required(process.env.DISCORD_TOKEN),
  
  MONGO_URL: optional(process.env.MONGO_URL),
  STRAVA_CLIENT_ID: optional(process.env.STRAVA_CLIENT_ID),
  STRAVA_CLIENT_SECRET: optional(process.env.STRAVA_CLIENT_SECRET),
  NODE_ENV: process.env.NODE_ENV || "development"
}

function required(str: undefined|string) {
  if (!str) throw new Error(`Missing environment variable`)
  return str;
}

// simple way to give default string value
function optional(str: undefined|string) {
  return !!str ? str : ""
}