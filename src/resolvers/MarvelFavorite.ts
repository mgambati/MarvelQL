import { Context } from '../utils/getContext';
import { Favorite } from '../generated/prisma';

export const linkTypeDefs = `
    extend type Favorite {
        character: Character
        comic: Comic
        creator: Creator
        event: Event
        series: Series
        story: Story
    }
`;
export const resolvers: any = {
	Favorite: {
		character: {
			fragment: `fragment CharacterFragment on Favorite { marvelId type }`,
			async resolve(parent: Favorite, _, ctx: Context, info) {
				const id = parent.marvelId;
				if (parent.type !== 'CHARACTER') {
					return null;
        }
        try {
        return await ctx.charactersModel.getOne({ id });
        } catch(e){
          console.error("Error at Favorite {character}", e);
          return new Error(e);
        }
			}
		},
		comic: {
			fragment: `fragment ComicFragment on Favorite { marvelId type }`,
			async resolve(parent: Favorite, _, ctx: Context, info) {
				const id = parent.marvelId;
				if (parent.type !== 'COMIC') {
					return null;
        }
        try {
          return await ctx.comicsModel.getById(id);
        } catch(e){
          console.error("Error at Favorite {comic}", e);
          return new Error(e);
        }
				
			}
    },
    creator: {
			fragment: `fragment CreatorFragment on Favorite { marvelId type }`,
			async resolve(parent: Favorite, _, ctx: Context, info) {
				const id = parent.marvelId;
				if (parent.type !== 'CREATOR') {
					return null;
        }
        try {
          return await ctx.creatorsModel.getById(id);
        } catch(e){
          console.error("Error at Favorite {creator}", e);
          return new Error(e);
        }
				
			}
    },
    event: {
			fragment: `fragment EventFragment on Favorite { marvelId type }`,
			async resolve(parent: Favorite, _, ctx: Context, info) {
				const id = parent.marvelId;
				if (parent.type !== 'EVENT') {
					return null;
        }
        try {
          return await ctx.eventsModel.getById(id);
        } catch(e){
          console.error("Error at Favorite {event}", e);
          return new Error(e);
        }
				
			}
    },
    series: {
			fragment: `fragment SeriesFragment on Favorite { marvelId type }`,
			async resolve(parent: Favorite, _, ctx: Context, info) {
				const id = parent.marvelId;
				if (parent.type !== 'SERIES') {
					return null;
        }
        try {
          return await ctx.seriesModel.getById(id);
        } catch(e){
          console.error("Error at Favorite {series}", e);
          return new Error(e);
        }
				
			}
    },
    story: {
			fragment: `fragment StoryFragment on Favorite { marvelId type }`,
			async resolve(parent: Favorite, _, ctx: Context, info) {
				const id = parent.marvelId;
				if (parent.type !== 'STORY') {
					return null;
        }
        try {
          return await ctx.storiesModel.getById(id);
        } catch(e){
          console.error("Error at Favorite {story}", e);
          return new Error(e);
        }
				
			}
		}
	}
};
