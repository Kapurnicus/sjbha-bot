import Cache from "node-cache";
import {StravaClient, StravaAuthClient} from "@bored/strava-client";
import config from "../config";
import Debug from "debug";
import ActivityEffort from "../domain/ActivityEffort";

const debug = Debug("c/fit:strava");

export default class Strava {
  // lets cache clients so we aren't
  // needlessly grabbing access tokens constantly
  static clientCache = new Cache({
    // 5 hours
    stdTTL: 60 * 60 * 5
  })

  constructor(
    private client: StravaClient
  ) {}

  public async getEffort(activityId: string) {
    const [zones, stream] = await Promise.all([
      this.client.getHRZones(),
      this.client.getActivityStreams(activityId)
    ])

    return new ActivityEffort(
      zones.heart_rate.zones.map(i => i.max),
      stream.heartrate.data, 
      stream.time.data
    );
  }

  public static async createClient(refreshToken: string) {
    const cache = this.clientCache.get<Strava>(refreshToken);

    if (!!cache) {
      debug('Load client from cache')
      return cache;
    }
  
    const auth = new StravaAuthClient(config.client_id, config.client_secret);
    const accessToken = await auth.getAccessToken(refreshToken);
  
    const client = new StravaClient(accessToken);
    this.clientCache.set(refreshToken, client);
    
    return new Strava(client);
  }
}