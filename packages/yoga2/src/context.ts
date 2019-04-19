import { prisma, Prisma } from '../.yoga/prisma-client'
import { yogaContext } from 'yoga'
import SuperHero from './superheroapi'

const stats = new SuperHero()
export interface Context {
  stats: SuperHero
  prisma: Prisma
}

export default yogaContext(({ req }) => ({
  req,
  stats,
  prisma,
}))
