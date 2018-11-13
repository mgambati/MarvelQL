import { Query } from './Query';
import { makeExecutableSchema } from 'graphql-tools';
import { extractFragmentReplacements } from 'prisma-binding';
import { FragmentReplacement } from 'graphql-binding';
import { MergeSchemaHelper } from '../utils/MergeSchemaHelper';
import { importSchema } from 'graphql-import';
import * as path from 'path';
import * as favorites from '../resolvers/MarvelFavorite';
import Mutation from '../resolvers/Mutation';
import { AuthPayload } from './AuthPayload';

const resolvers = {
	Query,
	Mutation,
	AuthPayload
};

const mergedSchema: MergeSchemaHelper = new MergeSchemaHelper();
mergedSchema.addSchema(
	makeExecutableSchema({
		typeDefs: importSchema(path.join(__dirname, '../schema.graphql')),
		resolvers,
		resolverValidationOptions: {
			requireResolversForResolveType: false
		} as any
	})
);

mergedSchema.addResolver(favorites.resolvers);
mergedSchema.addSchema(favorites.linkTypeDefs);

export const schema: any = mergedSchema.getSchema();

export const fragmentReplacements: FragmentReplacement[] = extractFragmentReplacements(
	resolvers
);
