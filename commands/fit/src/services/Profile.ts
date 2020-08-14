import Strava from "../infra/strava";
import Repository from "../infra/repository";
import {createEffortFromAPI} from "../models/ActivityEffort";

export default class ProfileService {
  constructor(
    private repository = new Repository()
  ) {}

  async addActivity(stravaId: string, activityId: string) {
    const user = await this.repository.getByStravaId(stravaId);

    // Athlete data
    const strava = new Strava();
    const client = await strava.getClient(user.refreshToken);

    const [athlete, activity, zones, stream] = await Promise.all([
      client.getProfile(),
      client.getActivity(activityId),
      client.getHRZones(),
      client.getActivityStreams(activityId)
    ]);

    const effort = createEffortFromAPI(zones, stream);

    console.log("effort", effort);
    // Fetch and save the refresh token for future requests
    // const levels = await getLevelByStravaId(ownerId);

    // console.log("levels ", levels);
  }

}