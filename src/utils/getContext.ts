import * as jwt from "jsonwebtoken";
import { Prisma } from "../generated/prisma";
import MarvelApiModel from "../models/MarvelApiModel";
import CharacterModel from "../models/CharacterModel";
export interface Context {
  db: Prisma;
  api: MarvelApiModel;
  charactersModel: CharacterModel;
  request: any;
}

export function getUserId(ctx: Context) {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.APP_SECRET) as {
      userId: string;
    };
    return userId;
  }

  throw new AuthError();
}

export class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}
