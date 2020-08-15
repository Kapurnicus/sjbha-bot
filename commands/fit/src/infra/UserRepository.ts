import * as mongodb from '@bored/mongodb';
import type {Collection} from "mongodb";
import dot from '@bored/mongodb-dot';
import Debug from "debug";
import { NotConnected } from "../errors";

import User from '../domain/User';
import Auth from "../domain/Auth";
import Profile from "../domain/Profile";

const debug = Debug("c/fit:repository");
const COLLECTION_NAME = 'fit-users';

export interface UserDTO {
  discordId: string;

  stravaId: string;
  password: string;
  refreshToken: string;

  xp: number;
}

export default class Repository {
  /** 
   * Shorthand getter for the mongo collection 
   * We do this instead of caching at the top to prevent any race conditions
   **/
  private get collection(): Collection<UserDTO> {
    return mongodb.getCollection(COLLECTION_NAME)
  }

  /** Create from Database object */
  private createUserFromDTO(dto: UserDTO) {
    return new User(
      dto.discordId,
      new Auth(dto.password, dto.stravaId, dto.refreshToken),
      new Profile(dto.xp)
    )
  }

  /** Convert back to DTO object */
  private userToDTO(user: User): UserDTO {
    const json = user.json();
    return {
      discordId   : json.id,
      password    : json.auth.password,
      stravaId    : json.auth.stravaId,
      refreshToken: json.auth.refreshToken,
      xp          : json.profile.exp
    }
  }

  /** Get a user by their Discord ID */
  async getById<T>(discordId: string) {
    const dto = await this.collection.findOne<UserDTO>({discordId});
    if (!dto) throw new NotConnected(`User with id '${discordId}' doesn't exist`);

    return this.createUserFromDTO(dto);
  }

  /** Get a user by their Strava ID */
  async getByStravaId<T>(stravaId: string) {
    const dto = await this.collection.findOne<UserDTO>({stravaId});
    if (!dto) throw new NotConnected(`User with strava id '${stravaId}' doesn't exist`);
  
    return this.createUserFromDTO(dto);
  }

  /** Create a new user */
  async insertUser(user: User) {
    const data = this.userToDTO(user);
    const exists = await this.collection.findOne<UserDTO>({discordId: data.discordId});
    
    if (exists) {
      throw new Error(`Can't insert new user; user with discord id ${data.discordId} already exists`)
    }

    // else, make it!
    await this.collection.insertOne(data);
  }

  /** Update the user. Will call $set and automatically convert object to dot notation */
  async update(user: User) {
    const data = this.userToDTO(user);

    await this.collection.replaceOne(
      {discordId: data.discordId},
      data
    )
  }
}