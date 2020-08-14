// Analayzes HR data and figures out how much time was spent in "rest", active or hard
// Zone 2 is considered "active" and anything higher than that is considered "hard"
// This is based off "moderate vs vigorous" activity articles out there, by recommendation of health officials

export class ActivityEffort {
  /** Time spent in rest (in seconds) */
  public readonly rest = 0;
  
  /** Time spent in a cardio mode (in seconds) */
  public readonly active = 0;

  /** Time spent in high intensity (in seconds) */
  public readonly hard = 0;

  constructor(zones: number[], heartrate: number[], time: number[]) {
    const zoneCache = new Map<number, number>();

    // Returns what zone a heart rate is in
    const  getZone = (heartrate: number) => {
      if (zoneCache.get(heartrate)) return zoneCache.get(heartrate);
  
      for (let i = 0; i <= zones.length; i++) {
        if (heartrate < zones[i]) {
          zoneCache.set(heartrate, i);
          return i;
        }
      }
  
      // The last zone has a max of '-1', presumable to say
      // "anything higher than this is zone 5"
      // so we default to the last zone
      zoneCache.set(heartrate, zones.length - 1);
      return zoneCache.get(heartrate);
    }

    // Loop through HR and add the totals
    for (let i = 0; i < heartrate.length; i++) {
      const hr = heartrate[i];
      const zone = getZone(hr);
      
      // Get time difference from prev tick
      let secInZone = (i === 0) ? time[i] : time[i] - time[i - 1];

      if (zone === 0) {
        this.rest += secInZone;
      } else if (zone === 1) {
        this.active += secInZone;
      } else {
        this.hard += secInZone;
      }
    }
  }
}


// Mappers
import { Strava } from "@bored/strava-client";

export async function createEffortFromAPI(zones: Strava.ZonesResponse, stream: Strava.ActivityStreamResponse) {
  return new ActivityEffort(
    zones.heart_rate.zones.map(i => i.max),
    stream.heartrate.data, 
    stream.time.data
  );
}