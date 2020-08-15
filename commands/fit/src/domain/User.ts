import Auth from "./Auth";
import Profile from "./Profile";
import ActivityEffort from "./ActivityEffort";

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

  get exp() { return this._profile.exp; }
  get level() { return this._profile.level; }

  public linkStrava(stravaId: string, refreshToken: string) {
    this._auth.linkToStrava(stravaId, refreshToken);
  }

  public addEffort(effort: ActivityEffort) {
    return this._profile.addEffort(effort);
  }

  public json = () => ({
    id: this.id,
    auth: this._auth.json(),
    profile: this._profile.json()
  })
}