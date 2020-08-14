export interface AuthResponse {
  refresh_token: string;
  access_token: string;
  athlete: { id: number; }  
}

export interface ActivityResponse {
  /** Activity ID */
  id: string;
  /** Metadata about the athlete who owns this activity */
  athlete: {id: string;}
  /** Distance traveled, in meters */
  distance: number;
  /** Time actually spent moving, in seconds */
  moving_time: number;
  /** Total time recorded, in seconds */
  elapsed_time: number;
  total_elevation_gain: number;
  /** Heart rate data? */
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  /** Type of activty (run, ride etc) */
  type: string;
  /** Name of the activity */
  name: string;
  description: string;
  /** Whether this activity is a commute */
  commute: boolean;
  /** GPS recorded or manually entered */
  manual: boolean;
  /** Is this activity set to private */
  private: boolean;
  /** Avereage speed, in meters/second */
  average_speed: number;
  /** Max speed, in meters/second*/
  max_speed: number;
  available_zones: string[];
  /** Device it was recorded on */
  device_name: string;
}

/**
 * @see http://developers.strava.com/docs/reference/#api-models-DetailedAthlete
 */
export interface AthleteResponse {
  id: number;
}

/**
 * @see https://developers.strava.com/docs/reference/#api-Athletes-getLoggedInAthleteZones
 */
export interface ZonesResponse {
  heart_rate: {
    custom_zones: boolean;
    zones: Zone[];
  }
}

interface Zone {
  min: number;
  max: number;
}

/**
 * @see https://developers.strava.com/docs/reference/#api-Streams-getActivityStreams
 */
export interface ActivityStreamResponse {
  distance: Stream;
  heartrate: Stream;
  time: Stream;
}

interface Stream {
  /** List of values recorded in the activity */
  data: number[];
  /** How the values in the array are calculated */
  series_type: "distance"|"time";
  original_size: number;
  resolution: string;
}