import * as querystring from "querystring";
import wretch from "@bored/node-wretch";
import {AuthResponse} from "./types";

const api = wretch().url('https://www.strava.com')

export default class StravaClient {
  constructor(
    private client_id: string,
    private client_secret: string
  ) {}

  getAuthorizationUrl = (redirect_uri: string, scope: string, state: string) => {
    const authParams = querystring.stringify({
      client_id: this.client_id, 
      redirect_uri, scope, state,
      response_type     : 'code',
      approval_prompt   : 'force'
    })
  
    return 'http://www.strava.com/oauth/authorize?' + authParams
  }

  /**
   * Get refresh token, use it for a user's first time in authenticating
   * 
   * @param code 
   */
  getRefreshToken = async (code: string) => {
    return api.url('/oauth/token')
      .post({
        code,
        client_id: this.client_id,
        client_secret: this.client_secret,
        grant_type: "authorization_code"
      })
      .json<AuthResponse>();
  }

  /**
   * If you already have gotten the refresh token, 
   * you can use this to get a temporary access token
   * 
   * @param code 
   */
  getAccessToken = async (refreshToken: string) => {
    const res = await api.url('/oauth/token')
      .post({
        client_id: this.client_id,
        client_secret: this.client_secret,
        refresh_token : refreshToken,
        grant_type    : "refresh_token"
      })
      .json<AuthResponse>();

    return res.access_token;
  }
}