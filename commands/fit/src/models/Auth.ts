import randomstring from "randomstring";
import Debug from "debug";

const debug = Debug("commands.fit:user-auth")

export default class Auth {
  constructor(
    private _password: string = randomstring.generate(),
    private _stravaId: string= "", 
    private _refreshToken: string=""
  ) {}

  /** Auto generated password, used for signing the oauth URL */
  get password() { return this._password; }
  /** Athlete ID for strava requests */
  get stravaId() { return this._stravaId; }
  /** Refresh token from strava, used to gain an access token in oauth grant flow */
  get refreshToken() { return this._refreshToken; }

  public linkToStrava = (stravaId: string, refreshToken: string) => {
    debug(`linking account to to strava->%o`, {stravaId, refreshToken});

    this._stravaId = stravaId;
    this._refreshToken = refreshToken;
  }

  public json = () => ({
    password: this._password,
    stravaId: this._stravaId,
    refreshToken: this._refreshToken
  })
}