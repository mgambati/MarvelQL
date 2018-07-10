import { Context } from "../utils/getContext";

export const Subscription = {
	feedSubscription: {
		subscribe: (parent, args, ctx: Context, info) => {
			return ctx.db.subscription.post(
				{
					where: {
						node: {
							isPublished: true
						}
					}
				},
				info
			);
		}
	}
};
