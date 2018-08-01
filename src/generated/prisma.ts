import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Options } from 'graphql-binding'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'

export interface Query {
    users: <T = User[]>(args: { where?: UserWhereInput, orderBy?: UserOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    favorites: <T = Favorite[]>(args: { where?: FavoriteWhereInput, orderBy?: FavoriteOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    user: <T = User | null>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    favorite: <T = Favorite | null>(args: { where: FavoriteWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    usersConnection: <T = UserConnection>(args: { where?: UserWhereInput, orderBy?: UserOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    favoritesConnection: <T = FavoriteConnection>(args: { where?: FavoriteWhereInput, orderBy?: FavoriteOrderByInput, skip?: Int, after?: String, before?: String, first?: Int, last?: Int }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    node: <T = Node | null>(args: { id: ID_Output }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createUser: <T = User>(args: { data: UserCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createFavorite: <T = Favorite>(args: { data: FavoriteCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUser: <T = User | null>(args: { data: UserUpdateInput, where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateFavorite: <T = Favorite | null>(args: { data: FavoriteUpdateInput, where: FavoriteWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteUser: <T = User | null>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteFavorite: <T = Favorite | null>(args: { where: FavoriteWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertUser: <T = User>(args: { where: UserWhereUniqueInput, create: UserCreateInput, update: UserUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertFavorite: <T = Favorite>(args: { where: FavoriteWhereUniqueInput, create: FavoriteCreateInput, update: FavoriteUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyUsers: <T = BatchPayload>(args: { data: UserUpdateInput, where?: UserWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyFavorites: <T = BatchPayload>(args: { data: FavoriteUpdateInput, where?: FavoriteWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyUsers: <T = BatchPayload>(args: { where?: UserWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyFavorites: <T = BatchPayload>(args: { where?: FavoriteWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {
    user: <T = UserSubscriptionPayload | null>(args: { where?: UserSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> ,
    favorite: <T = FavoriteSubscriptionPayload | null>(args: { where?: FavoriteSubscriptionWhereInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Exists {
  User: (where?: UserWhereInput) => Promise<boolean>
  Favorite: (where?: FavoriteWhereInput) => Promise<boolean>
}

export interface Prisma {
  query: Query
  mutation: Mutation
  subscription: Subscription
  exists: Exists
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
delegateSubscription(fieldName: string, args?: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(options: BasePrismaOptions): T
}
/**
 * Type Defs
*/

const typeDefs = `type AggregateFavorite {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  """The number of nodes that have been affected by the Batch operation."""
  count: Long!
}

scalar DateTime

type Favorite implements Node {
  id: ID!
  marvelId: ID
  user(where: UserWhereInput): User
  createdAt: DateTime!
  updatedAt: DateTime!
  type: FavoriteMarvelType!
}

"""A connection to a list of items."""
type FavoriteConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [FavoriteEdge]!
  aggregate: AggregateFavorite!
}

input FavoriteCreateInput {
  marvelId: ID
  type: FavoriteMarvelType!
  user: UserCreateOneWithoutFavoritesInput
}

input FavoriteCreateManyWithoutUserInput {
  create: [FavoriteCreateWithoutUserInput!]
  connect: [FavoriteWhereUniqueInput!]
}

input FavoriteCreateWithoutUserInput {
  marvelId: ID
  type: FavoriteMarvelType!
}

"""An edge in a connection."""
type FavoriteEdge {
  """The item at the end of the edge."""
  node: Favorite!

  """A cursor for use in pagination."""
  cursor: String!
}

enum FavoriteMarvelType {
  CHARACTER
  COMIC
  SERIES
  STORY
  EVENT
  CREATOR
}

enum FavoriteOrderByInput {
  id_ASC
  id_DESC
  marvelId_ASC
  marvelId_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  type_ASC
  type_DESC
}

type FavoritePreviousValues {
  id: ID!
  marvelId: ID
  createdAt: DateTime!
  updatedAt: DateTime!
  type: FavoriteMarvelType!
}

type FavoriteSubscriptionPayload {
  mutation: MutationType!
  node: Favorite
  updatedFields: [String!]
  previousValues: FavoritePreviousValues
}

input FavoriteSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [FavoriteSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [FavoriteSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [FavoriteSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: FavoriteWhereInput
}

input FavoriteUpdateInput {
  marvelId: ID
  type: FavoriteMarvelType
  user: UserUpdateOneWithoutFavoritesInput
}

input FavoriteUpdateManyWithoutUserInput {
  create: [FavoriteCreateWithoutUserInput!]
  connect: [FavoriteWhereUniqueInput!]
  disconnect: [FavoriteWhereUniqueInput!]
  delete: [FavoriteWhereUniqueInput!]
  update: [FavoriteUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [FavoriteUpsertWithWhereUniqueWithoutUserInput!]
}

input FavoriteUpdateWithoutUserDataInput {
  marvelId: ID
  type: FavoriteMarvelType
}

input FavoriteUpdateWithWhereUniqueWithoutUserInput {
  where: FavoriteWhereUniqueInput!
  data: FavoriteUpdateWithoutUserDataInput!
}

input FavoriteUpsertWithWhereUniqueWithoutUserInput {
  where: FavoriteWhereUniqueInput!
  update: FavoriteUpdateWithoutUserDataInput!
  create: FavoriteCreateWithoutUserInput!
}

input FavoriteWhereInput {
  """Logical AND on all given filters."""
  AND: [FavoriteWhereInput!]

  """Logical OR on all given filters."""
  OR: [FavoriteWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [FavoriteWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  marvelId: ID

  """All values that are not equal to given value."""
  marvelId_not: ID

  """All values that are contained in given list."""
  marvelId_in: [ID!]

  """All values that are not contained in given list."""
  marvelId_not_in: [ID!]

  """All values less than the given value."""
  marvelId_lt: ID

  """All values less than or equal the given value."""
  marvelId_lte: ID

  """All values greater than the given value."""
  marvelId_gt: ID

  """All values greater than or equal the given value."""
  marvelId_gte: ID

  """All values containing the given string."""
  marvelId_contains: ID

  """All values not containing the given string."""
  marvelId_not_contains: ID

  """All values starting with the given string."""
  marvelId_starts_with: ID

  """All values not starting with the given string."""
  marvelId_not_starts_with: ID

  """All values ending with the given string."""
  marvelId_ends_with: ID

  """All values not ending with the given string."""
  marvelId_not_ends_with: ID
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  type: FavoriteMarvelType

  """All values that are not equal to given value."""
  type_not: FavoriteMarvelType

  """All values that are contained in given list."""
  type_in: [FavoriteMarvelType!]

  """All values that are not contained in given list."""
  type_not_in: [FavoriteMarvelType!]
  user: UserWhereInput
}

input FavoriteWhereUniqueInput {
  id: ID
}

"""
The \`Long\` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

type Mutation {
  createUser(data: UserCreateInput!): User!
  createFavorite(data: FavoriteCreateInput!): Favorite!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateFavorite(data: FavoriteUpdateInput!, where: FavoriteWhereUniqueInput!): Favorite
  deleteUser(where: UserWhereUniqueInput!): User
  deleteFavorite(where: FavoriteWhereUniqueInput!): Favorite
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  upsertFavorite(where: FavoriteWhereUniqueInput!, create: FavoriteCreateInput!, update: FavoriteUpdateInput!): Favorite!
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput): BatchPayload!
  updateManyFavorites(data: FavoriteUpdateInput!, where: FavoriteWhereInput): BatchPayload!
  deleteManyUsers(where: UserWhereInput): BatchPayload!
  deleteManyFavorites(where: FavoriteWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

"""An object with an ID"""
interface Node {
  """The id of the object."""
  id: ID!
}

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: String

  """When paginating forwards, the cursor to continue."""
  endCursor: String
}

type Query {
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  favorites(where: FavoriteWhereInput, orderBy: FavoriteOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Favorite]!
  user(where: UserWhereUniqueInput!): User
  favorite(where: FavoriteWhereUniqueInput!): Favorite
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  favoritesConnection(where: FavoriteWhereInput, orderBy: FavoriteOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): FavoriteConnection!

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  favorite(where: FavoriteSubscriptionWhereInput): FavoriteSubscriptionPayload
}

type User implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  password: String!
  name: String!
  favorites(where: FavoriteWhereInput, orderBy: FavoriteOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Favorite!]
}

"""A connection to a list of items."""
type UserConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  email: String!
  password: String!
  name: String!
  favorites: FavoriteCreateManyWithoutUserInput
}

input UserCreateOneWithoutFavoritesInput {
  create: UserCreateWithoutFavoritesInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutFavoritesInput {
  email: String!
  password: String!
  name: String!
}

"""An edge in a connection."""
type UserEdge {
  """The item at the end of the edge."""
  node: User!

  """A cursor for use in pagination."""
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  name_ASC
  name_DESC
}

type UserPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  password: String!
  name: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [UserSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [UserSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [UserSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: UserWhereInput
}

input UserUpdateInput {
  email: String
  password: String
  name: String
  favorites: FavoriteUpdateManyWithoutUserInput
}

input UserUpdateOneWithoutFavoritesInput {
  create: UserCreateWithoutFavoritesInput
  connect: UserWhereUniqueInput
  disconnect: Boolean
  delete: Boolean
  update: UserUpdateWithoutFavoritesDataInput
  upsert: UserUpsertWithoutFavoritesInput
}

input UserUpdateWithoutFavoritesDataInput {
  email: String
  password: String
  name: String
}

input UserUpsertWithoutFavoritesInput {
  update: UserUpdateWithoutFavoritesDataInput!
  create: UserCreateWithoutFavoritesInput!
}

input UserWhereInput {
  """Logical AND on all given filters."""
  AND: [UserWhereInput!]

  """Logical OR on all given filters."""
  OR: [UserWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [UserWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  email: String

  """All values that are not equal to given value."""
  email_not: String

  """All values that are contained in given list."""
  email_in: [String!]

  """All values that are not contained in given list."""
  email_not_in: [String!]

  """All values less than the given value."""
  email_lt: String

  """All values less than or equal the given value."""
  email_lte: String

  """All values greater than the given value."""
  email_gt: String

  """All values greater than or equal the given value."""
  email_gte: String

  """All values containing the given string."""
  email_contains: String

  """All values not containing the given string."""
  email_not_contains: String

  """All values starting with the given string."""
  email_starts_with: String

  """All values not starting with the given string."""
  email_not_starts_with: String

  """All values ending with the given string."""
  email_ends_with: String

  """All values not ending with the given string."""
  email_not_ends_with: String
  password: String

  """All values that are not equal to given value."""
  password_not: String

  """All values that are contained in given list."""
  password_in: [String!]

  """All values that are not contained in given list."""
  password_not_in: [String!]

  """All values less than the given value."""
  password_lt: String

  """All values less than or equal the given value."""
  password_lte: String

  """All values greater than the given value."""
  password_gt: String

  """All values greater than or equal the given value."""
  password_gte: String

  """All values containing the given string."""
  password_contains: String

  """All values not containing the given string."""
  password_not_contains: String

  """All values starting with the given string."""
  password_starts_with: String

  """All values not starting with the given string."""
  password_not_starts_with: String

  """All values ending with the given string."""
  password_ends_with: String

  """All values not ending with the given string."""
  password_not_ends_with: String
  name: String

  """All values that are not equal to given value."""
  name_not: String

  """All values that are contained in given list."""
  name_in: [String!]

  """All values that are not contained in given list."""
  name_not_in: [String!]

  """All values less than the given value."""
  name_lt: String

  """All values less than or equal the given value."""
  name_lte: String

  """All values greater than the given value."""
  name_gt: String

  """All values greater than or equal the given value."""
  name_gte: String

  """All values containing the given string."""
  name_contains: String

  """All values not containing the given string."""
  name_not_contains: String

  """All values starting with the given string."""
  name_starts_with: String

  """All values not starting with the given string."""
  name_not_starts_with: String

  """All values ending with the given string."""
  name_ends_with: String

  """All values not ending with the given string."""
  name_not_ends_with: String
  favorites_every: FavoriteWhereInput
  favorites_some: FavoriteWhereInput
  favorites_none: FavoriteWhereInput
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({typeDefs})

/**
 * Types
*/

export type FavoriteMarvelType =   'CHARACTER' |
  'COMIC' |
  'SERIES' |
  'STORY' |
  'EVENT' |
  'CREATOR'

export type UserOrderByInput =   'id_ASC' |
  'id_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'email_ASC' |
  'email_DESC' |
  'password_ASC' |
  'password_DESC' |
  'name_ASC' |
  'name_DESC'

export type FavoriteOrderByInput =   'id_ASC' |
  'id_DESC' |
  'marvelId_ASC' |
  'marvelId_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'type_ASC' |
  'type_DESC'

export type MutationType =   'CREATED' |
  'UPDATED' |
  'DELETED'

export interface FavoriteCreateManyWithoutUserInput {
  create?: FavoriteCreateWithoutUserInput[] | FavoriteCreateWithoutUserInput
  connect?: FavoriteWhereUniqueInput[] | FavoriteWhereUniqueInput
}

export interface UserWhereInput {
  AND?: UserWhereInput[] | UserWhereInput
  OR?: UserWhereInput[] | UserWhereInput
  NOT?: UserWhereInput[] | UserWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  createdAt?: DateTime
  createdAt_not?: DateTime
  createdAt_in?: DateTime[] | DateTime
  createdAt_not_in?: DateTime[] | DateTime
  createdAt_lt?: DateTime
  createdAt_lte?: DateTime
  createdAt_gt?: DateTime
  createdAt_gte?: DateTime
  updatedAt?: DateTime
  updatedAt_not?: DateTime
  updatedAt_in?: DateTime[] | DateTime
  updatedAt_not_in?: DateTime[] | DateTime
  updatedAt_lt?: DateTime
  updatedAt_lte?: DateTime
  updatedAt_gt?: DateTime
  updatedAt_gte?: DateTime
  email?: String
  email_not?: String
  email_in?: String[] | String
  email_not_in?: String[] | String
  email_lt?: String
  email_lte?: String
  email_gt?: String
  email_gte?: String
  email_contains?: String
  email_not_contains?: String
  email_starts_with?: String
  email_not_starts_with?: String
  email_ends_with?: String
  email_not_ends_with?: String
  password?: String
  password_not?: String
  password_in?: String[] | String
  password_not_in?: String[] | String
  password_lt?: String
  password_lte?: String
  password_gt?: String
  password_gte?: String
  password_contains?: String
  password_not_contains?: String
  password_starts_with?: String
  password_not_starts_with?: String
  password_ends_with?: String
  password_not_ends_with?: String
  name?: String
  name_not?: String
  name_in?: String[] | String
  name_not_in?: String[] | String
  name_lt?: String
  name_lte?: String
  name_gt?: String
  name_gte?: String
  name_contains?: String
  name_not_contains?: String
  name_starts_with?: String
  name_not_starts_with?: String
  name_ends_with?: String
  name_not_ends_with?: String
  favorites_every?: FavoriteWhereInput
  favorites_some?: FavoriteWhereInput
  favorites_none?: FavoriteWhereInput
}

export interface UserCreateOneWithoutFavoritesInput {
  create?: UserCreateWithoutFavoritesInput
  connect?: UserWhereUniqueInput
}

export interface FavoriteWhereInput {
  AND?: FavoriteWhereInput[] | FavoriteWhereInput
  OR?: FavoriteWhereInput[] | FavoriteWhereInput
  NOT?: FavoriteWhereInput[] | FavoriteWhereInput
  id?: ID_Input
  id_not?: ID_Input
  id_in?: ID_Input[] | ID_Input
  id_not_in?: ID_Input[] | ID_Input
  id_lt?: ID_Input
  id_lte?: ID_Input
  id_gt?: ID_Input
  id_gte?: ID_Input
  id_contains?: ID_Input
  id_not_contains?: ID_Input
  id_starts_with?: ID_Input
  id_not_starts_with?: ID_Input
  id_ends_with?: ID_Input
  id_not_ends_with?: ID_Input
  marvelId?: ID_Input
  marvelId_not?: ID_Input
  marvelId_in?: ID_Input[] | ID_Input
  marvelId_not_in?: ID_Input[] | ID_Input
  marvelId_lt?: ID_Input
  marvelId_lte?: ID_Input
  marvelId_gt?: ID_Input
  marvelId_gte?: ID_Input
  marvelId_contains?: ID_Input
  marvelId_not_contains?: ID_Input
  marvelId_starts_with?: ID_Input
  marvelId_not_starts_with?: ID_Input
  marvelId_ends_with?: ID_Input
  marvelId_not_ends_with?: ID_Input
  createdAt?: DateTime
  createdAt_not?: DateTime
  createdAt_in?: DateTime[] | DateTime
  createdAt_not_in?: DateTime[] | DateTime
  createdAt_lt?: DateTime
  createdAt_lte?: DateTime
  createdAt_gt?: DateTime
  createdAt_gte?: DateTime
  updatedAt?: DateTime
  updatedAt_not?: DateTime
  updatedAt_in?: DateTime[] | DateTime
  updatedAt_not_in?: DateTime[] | DateTime
  updatedAt_lt?: DateTime
  updatedAt_lte?: DateTime
  updatedAt_gt?: DateTime
  updatedAt_gte?: DateTime
  type?: FavoriteMarvelType
  type_not?: FavoriteMarvelType
  type_in?: FavoriteMarvelType[] | FavoriteMarvelType
  type_not_in?: FavoriteMarvelType[] | FavoriteMarvelType
  user?: UserWhereInput
}

export interface FavoriteUpsertWithWhereUniqueWithoutUserInput {
  where: FavoriteWhereUniqueInput
  update: FavoriteUpdateWithoutUserDataInput
  create: FavoriteCreateWithoutUserInput
}

export interface UserCreateWithoutFavoritesInput {
  email: String
  password: String
  name: String
}

export interface FavoriteUpdateWithoutUserDataInput {
  marvelId?: ID_Input
  type?: FavoriteMarvelType
}

export interface UserSubscriptionWhereInput {
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: UserWhereInput
}

export interface FavoriteUpdateWithWhereUniqueWithoutUserInput {
  where: FavoriteWhereUniqueInput
  data: FavoriteUpdateWithoutUserDataInput
}

export interface FavoriteWhereUniqueInput {
  id?: ID_Input
}

export interface FavoriteUpdateManyWithoutUserInput {
  create?: FavoriteCreateWithoutUserInput[] | FavoriteCreateWithoutUserInput
  connect?: FavoriteWhereUniqueInput[] | FavoriteWhereUniqueInput
  disconnect?: FavoriteWhereUniqueInput[] | FavoriteWhereUniqueInput
  delete?: FavoriteWhereUniqueInput[] | FavoriteWhereUniqueInput
  update?: FavoriteUpdateWithWhereUniqueWithoutUserInput[] | FavoriteUpdateWithWhereUniqueWithoutUserInput
  upsert?: FavoriteUpsertWithWhereUniqueWithoutUserInput[] | FavoriteUpsertWithWhereUniqueWithoutUserInput
}

export interface UserUpdateWithoutFavoritesDataInput {
  email?: String
  password?: String
  name?: String
}

export interface FavoriteCreateInput {
  marvelId?: ID_Input
  type: FavoriteMarvelType
  user?: UserCreateOneWithoutFavoritesInput
}

export interface FavoriteCreateWithoutUserInput {
  marvelId?: ID_Input
  type: FavoriteMarvelType
}

export interface UserUpdateInput {
  email?: String
  password?: String
  name?: String
  favorites?: FavoriteUpdateManyWithoutUserInput
}

export interface UserCreateInput {
  email: String
  password: String
  name: String
  favorites?: FavoriteCreateManyWithoutUserInput
}

export interface UserUpdateOneWithoutFavoritesInput {
  create?: UserCreateWithoutFavoritesInput
  connect?: UserWhereUniqueInput
  disconnect?: Boolean
  delete?: Boolean
  update?: UserUpdateWithoutFavoritesDataInput
  upsert?: UserUpsertWithoutFavoritesInput
}

export interface UserUpsertWithoutFavoritesInput {
  update: UserUpdateWithoutFavoritesDataInput
  create: UserCreateWithoutFavoritesInput
}

export interface UserWhereUniqueInput {
  id?: ID_Input
  email?: String
}

export interface FavoriteSubscriptionWhereInput {
  AND?: FavoriteSubscriptionWhereInput[] | FavoriteSubscriptionWhereInput
  OR?: FavoriteSubscriptionWhereInput[] | FavoriteSubscriptionWhereInput
  NOT?: FavoriteSubscriptionWhereInput[] | FavoriteSubscriptionWhereInput
  mutation_in?: MutationType[] | MutationType
  updatedFields_contains?: String
  updatedFields_contains_every?: String[] | String
  updatedFields_contains_some?: String[] | String
  node?: FavoriteWhereInput
}

export interface FavoriteUpdateInput {
  marvelId?: ID_Input
  type?: FavoriteMarvelType
  user?: UserUpdateOneWithoutFavoritesInput
}

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output
}

export interface FavoritePreviousValues {
  id: ID_Output
  marvelId?: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  type: FavoriteMarvelType
}

/*
 * A connection to a list of items.

 */
export interface UserConnection {
  pageInfo: PageInfo
  edges: UserEdge[]
  aggregate: AggregateUser
}

export interface User extends Node {
  id: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  email: String
  password: String
  name: String
  favorites?: Favorite[]
}

export interface BatchPayload {
  count: Long
}

export interface AggregateFavorite {
  count: Int
}

export interface UserSubscriptionPayload {
  mutation: MutationType
  node?: User
  updatedFields?: String[]
  previousValues?: UserPreviousValues
}

export interface Favorite extends Node {
  id: ID_Output
  marvelId?: ID_Output
  user?: User
  createdAt: DateTime
  updatedAt: DateTime
  type: FavoriteMarvelType
}

export interface AggregateUser {
  count: Int
}

/*
 * An edge in a connection.

 */
export interface FavoriteEdge {
  node: Favorite
  cursor: String
}

export interface UserPreviousValues {
  id: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  email: String
  password: String
  name: String
}

/*
 * Information about pagination in a connection.

 */
export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String
  endCursor?: String
}

export interface FavoriteSubscriptionPayload {
  mutation: MutationType
  node?: Favorite
  updatedFields?: String[]
  previousValues?: FavoritePreviousValues
}

/*
 * An edge in a connection.

 */
export interface UserEdge {
  node: User
  cursor: String
}

/*
 * A connection to a list of items.

 */
export interface FavoriteConnection {
  pageInfo: PageInfo
  edges: FavoriteEdge[]
  aggregate: AggregateFavorite
}

/*
The `Long` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
*/
export type Long = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

export type DateTime = Date | string