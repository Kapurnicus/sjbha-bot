class Config {
  // These need to be passed in
  public basePath: string = "";
  public client_id: string = "";
  public client_secret: string = "";

  /** 
   * Authorization scopes  
   * @see https://developers.strava.com/docs/authentication/
   * 
   * `read` gives us access to public activities
   * `activity:read` 
   * `profile:read_all` lets us get HR zones
   **/
  public auth_scopes: string = "read,activity:read,profile:read_all";

  /** How long to delay between the webhook to posting to the channel to give people a chance to edit the title. In milliseconds  */
  public webhook_delay: number = 0;
}

export default new Config();