import Strava from "../infra/Strava";
import Repository from "../infra/UserRepository";

export default class ProfileService {
  constructor(
    private repository = new Repository()
  ) {}

  async addActivity(stravaId: string, activityId: string) {
    const user = await this.repository.getByStravaId(stravaId);

    // Athlete data
    const strava = await Strava.createClient(user.refreshToken);
    const effort = await strava.getEffort(activityId);
    
    const lvl = user.level;

    const expResult = user.addEffort(effort);
    const didLevelUp = lvl !== user.level;
    
    return {
      exp: expResult,
      prevLevel: lvl,
      currentLevel: user.level,
      didLevelUp: user.level > lvl
    }

    // const [athlete, activity, zones, stream] = await Promise.all([
    //   client.getProfile(),
    //   client.getActivity(activityId),
    //   client.getHRZones(),
    //   client.getActivityStreams(activityId)
    // ]);
    
    // Fetch and save the refresh token for future requests
    // const levels = await getLevelByStravaId(ownerId);

    // console.log("levels ", levels);
  }

}