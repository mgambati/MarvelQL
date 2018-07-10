import { Context } from "../utils/getContext";

export const Query = {
  async characters(_, args, ctx: Context, info) {
    return await ctx.charactersModel.getMany(
      args.where,
      args.orderBy,
      args.limit,
      args.offset
    );
  },
  //   async character(_, args, ctx: Context, info) {
  //     return await ctx.charactersModel.getOne(args.where);
  //   },
  async comics(_, args, ctx: Context, info) {
    return await ctx.api.comics(
      args.where,
      args.orderBy,
      args.limit,
      args.offset
    );
  },
  async creators(_, args, ctx: Context, info) {
    return await ctx.api.creators(
      args.where,
      args.orderBy,
      args.limit,
      args.offset
    );
  },
  async events(_, args, ctx: Context, info) {
    return await ctx.api.events(
      args.where,
      args.orderBy,
      args.limit,
      args.offset
    );
  },
  async series(_, args, ctx: Context, info) {
    return await ctx.api.series(
      args.where,
      args.orderBy,
      args.limit,
      args.offset
    );
  },
  async stories(_, args, ctx: Context, info) {
    return await ctx.api.stories(
      args.where,
      args.orderBy,
      args.limit,
      args.offset
    );
  }
  // me(parent, args, ctx: Context, info) {
  // 	const id = getUserId(ctx);
  // 	return ctx.db.query.user({ where: { id } }, info);
  // }
};
