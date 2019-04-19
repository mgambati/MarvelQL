import { idArg, prismaObjectType, stringArg } from 'yoga'

/*
type Mutation {
  deletePost(id: ID!): Post
  signupUser(name: String!, email: String!): User!
  createDraft(title: String!, content: String!, authorEmail: String!): Post!
  publish(id: ID!): Post!
}
 */
export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    // All fields from the underlying object type are exposed automatically
    // use `t.primaFields(['fieldName', ...])` to hide, customize, or select specific fields

    // This removes all fields from the underlying Mutation object type
    t.prismaFields([])

    t.field('signupUser', {
      type: 'User',
      args: {
        name: stringArg(),
        email: stringArg(),
      },
      resolve: (parent, { name, email }, ctx) => {
        return ctx.prisma.createUser({ name, email })
      },
    })

    t.field('createCharacterDraft', {
      type: 'Character',
      args: {},
      resolve: (
        parent,
        { marvelId, superheroId, thumbnail, modified, name, description },
        ctx,
      ) => {
        return ctx.prisma.createCharacter({
          marvelId,
          superheroId,
          thumbnail,
          modified,
          name,
          description,
        })
      },
    })

    t.field('publishCharacter', {
      type: 'Character',
      args: {
        id: idArg(),
      },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.updateCharacter({
          where: { id },
          data: { approved: true },
        })
      },
    })
  },
})
