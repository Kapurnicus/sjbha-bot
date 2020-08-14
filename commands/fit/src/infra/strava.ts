import Cache from "node-cache";
import {StravaClient, StravaAuthClient} from "@bored/strava-client";
import config from "../config";
import Debug from "debug";

const debug = Debug("c/fit:strava");

export default class Strava {
  // lets cache clients so we aren't
  // needlessly grabbing access tokens constantly
  cache = new Cache({
    // 5 hours
    stdTTL: 60 * 60 * 5
  })

  async getClient(refreshToken: string) {
    const cache = this.cache.get<StravaClient>(refreshToken);

    if (!!cache) {
      debug('Load client from cache')
      return cache;
    }
  
    const auth = new StravaAuthClient(config.client_id, config.client_secret);
    const accessToken = await auth.getAccessToken(refreshToken);
  
    const client = new StravaClient(accessToken);
    this.cache.set(refreshToken, client);
    
    return client;
  }
}