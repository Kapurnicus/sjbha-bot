import { Strava } from "@bored/strava-client";

interface Streams {
  // Heart rate maxes for each zone
  // i.e. [100, 140] means zone 0 is < 100, zone 1 < 140, etc
  heartrate: number[];
  time: number[];
}

export class Effort {
  /** Time spent in rest */
  public readonly rest = 0;
  /** Time spent in a cardio mode */
  public readonly active = 0;
  /** Time spent in high intensity */
  public readonly hard = 0;
  /** Total time spent */
  public get total() {
    return this.rest + this.active + this.hard;
  }

  constructor(zonesRaw: number[], streams: Streams) {
    const zones = new Zones(zonesRaw);

    for (let i = 0; i < streams.heartrate.length; i++) {
      if (i === 0) continue;

      const heartrate = streams.heartrate[i];
      // Get time difference from prev tick
      const time = streams.time[i] - streams.time[i - 1];

      const zone = zones.getZone(heartrate);

      if (zone === 0) {
        this.rest += time;
      } else if (zone === 1) {
        this.active += time;
      } else {
        this.hard += time;
      }
    }
  }
}

class Zones {
  cache: Record<number, number> = {};

  constructor(
    private zones: number[]
  ) {}

  getZone = (heartrate: number) => {
    if (this.cache[heartrate]) return this.cache[heartrate];

    for (let i = 0; i <= this.zones.length; i++) {
      if (heartrate < this.zones[i]) {
        this.cache[heartrate] = i;
        return i;
      }
    }

    this.cache[heartrate] = this.zones.length - 1;
    return this.cache[heartrate];
  }
}

export async function getEffort(zones: Strava.ZonesResponse, stream: Strava.ActivityStreamResponse) {
  return new Effort(
    zones.heart_rate.zones.map(i => i.max),
    {heartrate: stream.heartrate.data, time: stream.time.data}
  );
}