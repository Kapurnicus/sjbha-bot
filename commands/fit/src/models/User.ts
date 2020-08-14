import Auth from "./Auth";
import Profile from "./Profile";

export default class User {
  constructor(
    public readonly id: string,
    private readonly _auth: Auth = new Auth(),
    private readonly _profile: Profile = new Profile()
  ) {
    if (!this.id) throw new Error("Cannot create User, missing required field `id`")
  }

  get password() { return this._auth.password; }
  get refreshToken() { return this._auth.refreshToken; }

  public linkStrava(stravaId: string, refreshToken: string) {
    this._auth.linkToStrava(stravaId, refreshToken);
  }

  public json = () => ({
    id: this.id,
    auth: this._auth.json(),
    profile: this._profile.json()
  })
}