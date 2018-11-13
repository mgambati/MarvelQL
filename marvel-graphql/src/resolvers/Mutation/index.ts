import { getUserId } from '../../utils/getUser';
import { FavoriteCreateInput } from '../../generated/prisma';
import { Context } from '../../utils/getContext';
import { auth } from './auth';

export default {
	...auth,
	createFavorite(_, args: { data: FavoriteCreateInput }, ctx: Context, info) {
		return ctx.db.mutation.createFavorite(args, info);
	},
	async favorite(_, args: { input: FavoriteCreateInput }, ctx: Context, info) {
		const userId = await getUserId(ctx);
		return await ctx.db.mutation.createFavorite(
			{
				data: {
					...args.input,
					user: {
						connect: {
							id: userId
						}
					}
				}
			},
			info
		);
	},
	async unfavorite(_, args: { id: string }, ctx: Context, info) {
		const userId = await getUserId(ctx);
		return await ctx.db.mutation.deleteFavorite(
			{
				where: {
					id: args.id
				}
			},
			info
		);
	}
};
