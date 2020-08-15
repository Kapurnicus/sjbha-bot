import config from "../config";
import {StravaAuthClient} from "@bored/strava-client";
import Repository from "../infra/UserRepository";
import { NotConnected, Unauthorized } from "../errors";
import User from "../domain/User";

export default class Authorization {
  constructor(
    private repository = new Repository()
  ) {}

  async initializeUser(discordId: string) {
    try {
      const user = await this.repository.getById(discordId);
      return user;
    } catch (e) {
      if (e.name !== NotConnected.type) throw (e);

      const user = new User(discordId);
      await this.repository.insertUser(user);
      return user;
    }
  }

  async getAuthorizedUser(discordId: string, password: string) {
    const user = await this.repository.getById(discordId);

    if (user.password !== password) {
      throw new Unauthorized("")
    }

    return user;
  }

  async getAuthorizationUrl(discordId: string, password: string) {
    const user = await this.getAuthorizedUser(discordId, password);

    // todo: move to strava service
    const authClient = new StravaAuthClient(
      config.client_id,
      config.client_secret
    )

    return authClient
      .getAuthorizationUrl(
        config.basePath + "/accept",
        config.auth_scopes,
        user.id + "." + user.password
      );
  }

  async acceptStravaCode(discordId: string, password: string, code: string) {
    const user = await this.getAuthorizedUser(discordId, password);

    const client = new StravaAuthClient(
      config.client_id,
      config.client_secret
    )

    // Fetch and save the refresh token for future requests
    const {
      athlete, 
      refresh_token
    } = await client.getRefreshToken(code);

    user.linkStrava(String(athlete.id), refresh_token);

    await this.repository.update(user);
  }
}