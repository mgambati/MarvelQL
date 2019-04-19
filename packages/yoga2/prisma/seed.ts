import { prisma } from '../.yoga/prisma-client';

async function main() {
  await prisma.createUser({
    email: 'alice@prisma.io',
    name: 'Alice',
  });
  await prisma.createUser({
    email: 'bob@prisma.io',
    name: 'Bob',
  });
  await prisma.createCharacter({
    marvelId: 1009610,
    superheroId: 620,
    thumbnail: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg',
    modified: '2018-06-19T16:39:38-0400',
    name: 'Spider-Man',
    description:
      'Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider. Adopting the name Spider-Man, Peter hoped to start a career using his new abilities. Taught that with great power comes great responsibility, Spidey has vowed to use his powers to help people.',
  });
  await prisma.createCharacter({
    marvelId: 1010338,
    superheroId: 157,
    thumbnail: 'http://i.annihil.us/u/prod/marvel/i/mg/6/80/5269608c1be7a.jpg',
    name: 'Captain Marvel',
    description: `Former Air Force pilot and intelligence agent Carol Danvers pursued her dream of space exploration as a NASA employee, but her life forever changed when she was accidentally transformed into a human-Kree hybrid with extraordinary powers.
      Now, Carol is the latest warrior to embrace the mantle of Captain Marvel, and she has taken her place as one of the world’s mightiest heroes.`,
  });
}

main().catch(e => console.error(e));
