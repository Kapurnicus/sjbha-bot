import Debug from 'debug';
import wretch from "@bored/node-wretch";
import {
  ActivityResponse, 
  AthleteResponse, 
  ZonesResponse,
  ActivityStreamResponse
} from "./types";

const debug = Debug(`strava:client`)

/**
 * Interaction with the strava Rest API
 */
export default class StravaClient {
  /** Wretch instance ready with auth */
  private api: ReturnType<typeof wretch>;

  constructor(accessToken: string) {
    this.api = wretch()
      .url('https://www.strava.com/api/v3/')
      .headers({
        Authorization: "Bearer " + accessToken
      })
  }

  // /** 
  //  * Get basic Athlete information 
  //  **/

  getProfile() {
    const url = `/athlete`;
    debug('GET %o', url);
    
    return this.api
      .url(url)
      .get()
      .json<AthleteResponse>()
  }

  /**
   * Get a specific activity by ID
   * 
   * @param activityId 
   */

  getActivity(activityId: string) {
    const url = `/activities/${activityId}`;
    debug('GET %o', url);
    
    return this.api
      .url(url)
      .get()
      .json<ActivityResponse>()    
  } 

  // /**
  //  * Get a breakdown of HR zones for a user
  //  */

  getHRZones() {
    const url = `/athlete/zones`;
    debug('GET %o', url);
    
    return this.api
      .url(url)
      .get()
      .json<ZonesResponse>()
  }

  /** 
   * Get heartrate data from an activity
   * 
   * @param activityId
  */
 
  getActivityStreams(activityId: string) {
    const url = `/activities/${activityId}/streams`;
    debug('GET %o', url);
    
    return this.api
      .url(url)
      .query({
        keys: "heartrate,time",
        key_by_type: true
      })
      .get()
      .json<ActivityStreamResponse>();
  }
}