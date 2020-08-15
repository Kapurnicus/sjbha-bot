import type { Bastion } from "@bored/bastion";

// Add bastion to the express request instance
declare global {
  namespace Express {
    export interface Request {
      bastion: Bastion;
    }
  }
}