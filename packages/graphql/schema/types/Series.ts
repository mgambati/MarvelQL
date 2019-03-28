import { objectType, inputObjectType, enumType } from 'nexus';
export const Series = objectType({
    name: "Series",
    definition(t) {
        t.implements("MarvelNode");
        t.string("title", {
            nullable: true,
            description: 'The canonical title of the series.',
        });
        t.string("description", {
            nullable: true,
            description: 'A description of the series.',
        });
        t.list.field("urls", {
            type: "MarvelUrl",
            nullable: true,
            description: 'A set of public web site URLs for the resource.',
        });
        t.int("startYear", {
            nullable: true,
            description: 'The first year of publication for the series.',
        });
        t.int("endYear", {
            nullable: true,
            description: 'The last year of publication for the series (conventionally, 2099 for ongoing series) .',
        });
        t.string("rating", {
            nullable: true,
            description: 'The age-appropriateness rating for the series.',
        });
        t.list.field("comics", {
            type: "Comic",
            nullable: true,
            description: 'A list of comics (Comic Types) related to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "comics",
                    cardinality: "many-one",
                    data: parent
                })
            }
        });
        t.list.field("stories", {
            type: "Story",
            nullable: true,
            description: 'A list of stories (Story Types) related to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "stories",
                    data: parent
                })
            }
        });
        t.list.field("events", {
            type: "Event",
            nullable: true,
            description: 'A list of events (Event Types) related to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "events",
                    data: parent
                })
            }
        });
        t.list.field("characters", {
            type: "Character",
            nullable: true,
            description: 'A list of characters (Character Types) related to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "characters",
                    data: parent
                })
            }
        });
        t.list.field("creators", {
            type: "Creator",
            nullable: true,
            description: 'A list of creators (Creator Types) related to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "creators",
                    data: parent
                })
            }
        });
        t.field("next", {
            type: "Series",
            nullable: true,
            description: 'A list of previous series (Series Types) in relation to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "next",
                    connectionType: "series",
                    cardinality: "one-one",
                    data: parent
                })
            }
        });
        t.field("previous", {
            type: "Series",
            nullable: true,
            description: 'A list of previous series (Series Types) in relation to this series',
            async resolve(parent: any, args, ctx) {
                return ctx.seriesModel.getConnection({
                    connectionName: "previous",
                    connectionType: "series",
                    cardinality: "one-one",
                    data: parent
                })
            }
        });
    }
});
export const SeriesWhereInput = inputObjectType({
    name: "SeriesWhereInput",
    description: 'Optional filters for series. See notes on individual inputs below.',
    definition(t) {
        t.string("title", { description: 'Return only series matching the specified title.' });
        t.string("titleStartsWith", { description: 'Return series with titles that begin with the specified string (e.g. Sp).' });
        t.int("startYear", { description: 'Return only series matching the specified start year.' });
        t.field("modifiedSince", {
            type: "DateTime",
            description: 'Return only series which have been modified since the specified date.',
        });
        t.field("contains", {
            type: "ComicFormat",
            description: 'Return only series containing one or more comics with the specified format.',
        });
        t.field("seriesType", {
            type: "SeriesType",
            description: 'Filter the series by publication frequency type.',
        });
        t.list.id("comics", { description: 'Return only series which contain the specified comics (accepts a comma-separated list of ids).' });
        t.list.id("stories", { description: 'Return only series which contain the specified stories (accepts a comma-separated list of ids).' });
        t.list.id("events", { description: 'Return only series which have comics that take place during the specified events (accepts a comma-separated list of ids).' });
        t.list.id("creators", { description: 'Return only series which feature work by the specified creators (accepts a comma-separated list of ids).' });
        t.list.id("characters", { description: 'Return only series which feature the specified characters (accepts a comma-separated list of ids).' });
    }
});
export const SeriesOrderBy = enumType({
    name: "SeriesOrderBy",
    description: 'Order the result set by a field or fields. Multiple values are given priority in the order in which they are passed.',
    members: ['title_asc', 'modified_asc', 'startYear_asc', 'title_desc', 'modified_desc', 'startYear_desc'],
});
export const SeriesType = enumType({
    name: "SeriesType",
    description: 'Filter the series by publication frequency type.',
    members: [{ description: 'Filter the series with a collection publication frequency.', name: 'collection', value: 'collection' }, { description: 'Filter the series with a one shot publication frequency.', name: 'one_shot', value: 'one_shot' }, { description: 'Filter the series with a limited publication frequency.', name: 'limited', value: 'limited' }, { description: 'Filter the series with a ongoing publication frequency.', name: 'ongoing', value: 'ongoing' }],
});