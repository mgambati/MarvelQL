import { objectType, enumType, inputObjectType } from "nexus";

export const Character = objectType({
    name: "Character",
    definition(t) {
        t.implements("MarvelNode")
        t.string("name", {
            nullable: true,
            description: 'The name of the character.',
        })
        t.string("description", {
            nullable: true,
            description: 'A short bio or description of the character.',
        })
        t.list.field("urls", {
            type: "MarvelUrl",
            nullable: true,
            description: 'A set of public web site URLs for the resource.',
        })
        t.list.field("comics", {
            type: "Comic",
            nullable: true,
            description: 'Lists of comics filtered by a character id.',
            async resolve(parent: any, args, ctx) {
                const res = (await ctx.api.get(`/characters/${parent.id}/comics`))
                return res.results;
                // return (await parent.comics).map(async item => {
                //     let id = item.id;
                //     if (!id && item.resourceURI) {
                //         id = ctx.comicsModel.extractId(item.resourceURI);
                //     }
                //     const c = await ctx.comicsModel.getById(id)
                //     return c;
                // });
            }
        })
        t.list.field("series", {
            type: "Series",
            nullable: true,
            description: 'Lists of series filtered by a character id.',
            async resolve(parent: any, args, ctx) {
                const res = (await ctx.api.get(`/characters/${parent.id}/series`))
                return res.results;
                // return (await parent.series).map(async item => {
                //     let id = item.id;
                //     if (!id && item.resourceURI) {
                //         id = ctx.seriesModel.extractId(item.resourceURI);
                //     }
                //     const c = await ctx.seriesModel.getById(id)
                //     return c;
                // });
            }
        })
        t.list.field("events", {
            type: "Event",
            nullable: true,
            description: 'Lists of events filtered by a character id.',
            async resolve(parent: any, args, ctx) {
                const res = (await ctx.api.get(`/characters/${parent.id}/events`))
                return res.results
                // return (await parent.events).map(async item => {
                // let id = item.id;
                // if (!id && item.resourceURI) {
                //     id = ctx.eventsModel.extractId(item.resourceURI);
                // }
                // const c = await ctx.eventsModel.getById(id)
                // return c;
                // });
            }
        })
        t.list.field("stories", {
            type: "Story",
            nullable: true,
            description: 'Lists of stories filtered by a character id.',
            async resolve(parent: any, args, ctx) {
                const res = (await ctx.api.get(`/characters/${parent.id}/stories`))
                console.log(res.results[0])
                return res.results;
                // return (await parent.stories).map(async item => {
                // let id = item.id;
                // if (!id && item.resourceURI) {
                //     id = ctx.storiesModel.extractId(item.resourceURI);
                // }
                // const c = await ctx.storiesModel.getById(id)
                // return c;
                // });
            }
        })
    }
})

export const CharacterOrderBy = enumType({
    name: "CharacterOrderBy",
    description: 'Orders the result set by a field or fields. Multiple values are given priority in the order in which they are passed.',
    members: [{ description: 'Returns character in A-Z order (i.e 3-D Man, A-Bomb (HAS), A.I.M, etc...)', name: 'name_asc', value: 'name_asc' }, { description: 'Returns character in Z-A order (i.e , etc...)', name: 'name_desc', value: 'name_desc' }, { description: "Returns character's modification date in ascending order", name: 'modified_asc', value: 'modified_asc' }, { description: "Returns character's modification date in descending order", name: 'modified_desc', value: 'modified_desc' }],
});
export const CharacterWhereInput = inputObjectType({
    name: "CharacterWhereInput",
    description: 'Optional filters for characters. See notes on individual inputs below.',
    definition(t) {
        t.int("id", { description: 'Returns only characters matching the specified id' });
        t.string("name", { description: 'Returns only characters matching the specified full character name (e.g. Spider-Man).' });
        t.string("nameStartsWith", { description: 'Returns characters with names that begin with the specified string (e.g. Sp).' });
        t.string("modifiedSince", { description: 'Returns only characters which have been modified since the specified date.' });
        t.list.id("comics", { description: 'Returns only characters which appear in the specified comics (accepts a comma-separated list of ids).' });
        t.list.id("series", { description: 'Returns only characters which appear the specified series (accepts a comma-separated list of ids).' });
        t.list.id("events", { description: 'Returns only characters which appear in the specified events (accepts a comma-separated list of ids).' });
        t.list.id("stories", { description: 'Returns only characters which appear the specified stories (accepts a comma-separated list of ids).' });
    }
});
