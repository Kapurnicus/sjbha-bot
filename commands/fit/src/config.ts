import { Bastion } from "@bored/bastion";

const currentConfig = {
  basePath: "",
  client_id: "",
  client_secret: "",

  /** The channel ID to post new activities to */
  post_to_channel: "",

  /** 
   * Authorization scopes  
   * @see https://developers.strava.com/docs/authentication/
   * 
   * `read` gives us access to public activities
   * `activity:read` 
   * `profile:read_all` lets us get HR zones
   **/
  auth_scopes: "read,activity:read,profile:read_all",

  /** How long to delay between the webhook to posting to the channel to give people a chance to edit the title. In milliseconds  */
  webhook_delay: 0,

  /** Converts seconds from activity to experience points */
  exp_multi: (1/60),

  /** Additional multiplier for `hard` seconds */
  hard_multi: 2
}

export type Config = typeof currentConfig;
export default currentConfig;

export const setConfig = (config: Partial<Config>) => {
  Object.assign(currentConfig, config);
}