// import merge from "deepmerge";
// import {getUserByStravaId} from "../infra/repository";
// import { NotConnected } from "../errors";

// interface LevelingState {
//   discordId: string;
//   stravaId: string;

//   xp: number;
// }

// const initialState: LevelingState = {
//   discordId: "",
//   stravaId: "",

//   xp: 0
// }

// export class UserLevel {
//   private state: LevelingState;

//   constructor(state: Partial<LevelingState>) {
//     this.state = merge(initialState, state);
//   }
// }

// export async function getLevelByStravaId(stravaId: string) {
//   const user = await getUserByStravaId(stravaId);

//   if (!user) throw new NotConnected(`Auth User with strava id '${stravaId}' doesn't exist`);

//   return new UserLevel({
//     discordId: user.discordId,
//     stravaId,
//     xp: user.profile.xp
//   });  
// }