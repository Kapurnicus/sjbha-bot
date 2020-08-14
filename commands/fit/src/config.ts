const currentConfig = {
  basePath: "",
  client_id: "",
  client_secret: "",

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
  webhook_delay: 0
}

export type Config = typeof currentConfig;
export default currentConfig;