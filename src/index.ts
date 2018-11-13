import { GraphQLServer } from 'graphql-yoga';
import MarvelApiModel from './models/MarvelApiModel';
import { schema, fragmentReplacements } from './resolvers';
import CharacterModel from './models/CharacterModel';
import ComicModel from './models/ComicModel';
import CreatorModel from './models/CreatorModel';
import EventModel from './models/EventModel';
import SeriesModel from './models/SeriesModel';
import StoryModel from './models/StoryModel';

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	schema,
	context: (req) => ({
		...req,
		api: new MarvelApiModel(),
		charactersModel: new CharacterModel(),
		comicsModel: new ComicModel(),
		creatorsModel: new CreatorModel(),
		eventsModel: new EventModel(),
		seriesModel: new SeriesModel(),
		storiesModel: new StoryModel()
	})
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
