import { Context } from '../utils/getContext';
export const Character = {
	async comics(parent, args, ctx: Context, info) {
		const comicsSummary = await parent.comicsSummary;
		return await Promise.all(
			comicsSummary.map(async (comic, i) => {
				if (i >= 4) {
					return;
				}
				return await ctx.api.getConnections(comic.resourceURI);
			})
		);
	}
};
