import * as mongodb from '@bored/mongodb';
import type {Collection} from "mongodb";
import dot from '@bored/mongodb-dot';
import Debug from "debug";
import { NotConnected, Unauthorized } from "../errors";
import User from "../models/User";
import * as Mapper from "../models/User";

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

  /** Shorthand for findOne, and we exclude the _id property */
  private findOne(query: any) {
    return this.collection.findOne<UserDTO>(
      query, 
      {projection: {_id: 0}}
    );
  }

  /** Get a user by their Discord ID */
  async getById<T>(discordId: string) {
    const dto = await this.findOne({discordId});
    if (!dto) throw new NotConnected(`User with id '${discordId}' doesn't exist`);

    return Mapper.createUserFromDTO(dto);
  }

  /** Get a user by their Strava ID */
  async getByStravaId<T>(stravaId: string) {
    const dto = await this.findOne({stravaId});
    if (!dto) throw new NotConnected(`User with strava id '${stravaId}' doesn't exist`);
  
    return Mapper.createUserFromDTO(dto);
  }

  /** Create a new user */
  async insertUser(user: UserDTO) {
    const exists = await this.findOne({discordId: user.discordId});
    
    if (exists) {
      throw new Error(`Can't insert new user; user with discord id ${user.discordId} already exists`)
    }

    // else, make it!
    await this.collection.insertOne(user);
  }

  /** Update the user. Will call $set and automatically convert object to dot notation */
  async update(discordId: string, set: UserDTO) {
    await this.collection.updateOne(
      {discordId},
      {$set: dot(set)}
    )
  }
}