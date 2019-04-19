import { prismaExtendType, objectType } from 'yoga'

export const Stats = objectType({
  name: 'Stats',
  definition(t) {
    t.string('id'),
      t.string('response'),
      t.string('name'),
      t.field('powerstats', {
        type: PowerStats,
        nullable: true,
      })
    t.field('biography', {
      type: Biography,
      nullable: true,
    })
    t.field('appearance', {
      type: Appearance,
      nullable: true,
    })
    t.field('work', {
      type: Work,
      nullable: true,
    })
    t.field('connections', {
      type: Connections,
      nullable: true,
    })
    t.field('image', {
      type: Image,
      nullable: true,
    })
  },
})

export const Character = prismaExtendType({
  type: 'Character',
  definition(t) {
    // If you wish you customize/hide fields, call `t.prismaFields(['id', ...])` with the desired field names
    // If you wish to add custom fields on top of prisma's ones, use t.field/string/int...
    t.prismaFields(['*'])
    t.field('stats', {
      type: Stats,
      resolve: async (root, args, ctx, info) => {
        const stats = await ctx.stats.getOne(root.superheroId).then(res => res)

        return stats
      },
      nullable: true,
    })
  },
})
export const Work = objectType({
  name: 'Work',
  definition(t) {
    t.string('occupation', { nullable: true })
    t.string('base', { nullable: true })
  },
})

export const Appearance = objectType({
  name: 'Appearance',
  definition(t) {
    t.string('gender', { nullable: true })
    t.string('race', { nullable: true })
    t.string('height', {
      list: [false],
      nullable: true,
    })
    t.string('weight', {
      list: [false],
      nullable: true,
    })
    t.string('eyeColor', { nullable: true })
    t.string('hairColor', { nullable: true })
  },
})
export const Biography = objectType({
  name: 'Biography',
  definition(t) {
    t.string('fullName', { nullable: true })
    t.string('alterEgos', { nullable: true })
    t.string('aliases', {
      list: [false],
      nullable: true,
    })
    t.string('placeOfBirth', { nullable: true })
    t.string('firstAppearance', { nullable: true })
    t.string('publisher', { nullable: true })
    t.string('alignment', { nullable: true })
  },
})

export const Connections = objectType({
  name: 'Connections',
  definition(t) {
    t.string('groupAffiliation', { nullable: true })
    t.string('relatives', { nullable: true })
  },
})

export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.string('url', { nullable: true })
  },
})

export const PowerStats = objectType({
  name: 'PowerStats',
  definition(t) {
    t.string('intelligence', { nullable: true })
    t.string('strength', { nullable: true })
    t.string('speed', { nullable: true })
    t.string('durability', { nullable: true })
    t.string('power', { nullable: true })
    t.string('combat', { nullable: true })
  },
})
