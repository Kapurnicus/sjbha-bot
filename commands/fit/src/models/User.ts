import Auth from "./Auth";
import Profile from "./Profile";

interface Props {
  auth: Auth;
  profile: Profile;
}

export default class User {
  constructor(
    public readonly id: string,
    private readonly props: Props
  ) {
    if (!this.id) throw new Error("Cannot create User, missing required field `id`")
  }

  get password() { return this.props.auth.password; }
  get refreshToken() { return this.props.auth.refreshToken; }

  public linkStrava(stravaId: string, refreshToken: string) {
    this.props.auth.linkToStrava(stravaId, refreshToken);
  }

  public json = () => ({
    id: this.id,
    auth: this.props.auth.json(),
    profile: this.props.profile.json()
  })
}

// Mappings
import { UserDTO } from "../infra/repository";

/** Create from Database object */
export const createUserFromDTO = (dto: UserDTO) => new User(
  dto.discordId,
  {
    auth: new Auth(dto.password, dto.stravaId, dto.refreshToken),
    profile: new Profile(dto.xp)
  })

/** Creates a blank user */
export const createUserFromDiscordId = (discordId: string) => new User(
  discordId,
  {
    auth: new Auth(),
    profile: new Profile()
  })

/** Convert back to DTO object */
export const userToDTO = (user: User): UserDTO => {
  const json = user.json();
  return {
    discordId   : json.id,
    password    : json.auth.password,
    stravaId    : json.auth.stravaId,
    refreshToken: json.auth.refreshToken,
    xp          : json.profile.xp
  }
}