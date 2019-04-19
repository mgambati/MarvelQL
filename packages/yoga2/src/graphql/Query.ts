import { prismaObjectType, stringArg } from 'yoga'

/*
type Query {
  feed: [Post!]!
  filterPosts(searchString: String!): [Post!]!
}
*/
export const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    // All fields from the underlying object type are exposed automatically
    // use `t.primaFields(['fieldName', ...])` to hide, customize, or select specific fields

    // This removes all fields from the underlying Query object type
    t.prismaFields([])

    t.list.field('characters', {
      type: 'Character',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.characters({
          where: { approved: true },
        })
      },
    })

    t.list.field('filterCharacters', {
      type: 'Character',
      args: {
        searchString: stringArg(),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.characters({
          where: {
            OR: [
              {
                name_contains: searchString,
                description_contains: searchString,
              },
            ],
          },
        })
      },
    })
  },
})
