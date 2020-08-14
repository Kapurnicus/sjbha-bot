
// Mappings
import Auth from "./Auth";
import Profile from "./Profile";
import User from "./User";

import { UserDTO } from "../services/Repository";

/** Create from Database object */
export const createUserFromDTO = (dto: UserDTO) => new User(
  dto.discordId,
  new Auth(dto.password, dto.stravaId, dto.refreshToken),
  new Profile(dto.xp)
)

/** Creates a blank user */
export const createUserFromDiscordId = (discordId: string) => 
  new User(discordId);

/** Convert back to DTO object */
export const userToDTO = (user: User): UserDTO => {
  const json = user.json();
  return {
    discordId   : json.id,
    password    : json.auth.password,
    stravaId    : json.auth.stravaId,
    refreshToken: json.auth.refreshToken,
    xp          : json.profile.xp
  }
}


// Effort
import ActivityEffort from "./ActivityEffort";
import { Strava } from "@bored/strava-client";

export async function createEffortFromAPI(zones: Strava.ZonesResponse, stream: Strava.ActivityStreamResponse) {
  return new ActivityEffort(
    zones.heart_rate.zones.map(i => i.max),
    stream.heartrate.data, 
    stream.time.data
  );
}