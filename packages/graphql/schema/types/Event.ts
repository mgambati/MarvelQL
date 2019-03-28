import { objectType, inputObjectType, enumType } from 'nexus';
export const Event = objectType({
    name: "Event",
    definition(t) {
        t.implements("MarvelNode");
        t.string("title", {
            nullable: true,
            description: 'The title of the event.'
        });
        t.string("description", {
            nullable: true,
            description: 'A description of the event.',
        });
        t.list.field("urls", {
            type: "MarvelUrl",
            nullable: true,
            description: 'A set of public web site URLs for the resource.',
        });
        t.string("start", {
            nullable: true,
            description: 'The date of publication of the first issue in this event.',
        });
        t.string("end", {
            nullable: true,
            description: 'The date of publication of the last issue in this event.',
        });
        t.list.field("series", {
            type: "Series",
            nullable: true,
            description: 'A list of series (Series Types) related to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "series",
                    data: parent
                })
            }
        });
        t.list.field("stories", {
            type: "Story",
            nullable: true,
            description: 'A list of stories (Story Types) related to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "stories",
                    data: parent
                })
            }
        });
        t.list.field("comics", {
            type: "Comic",
            nullable: true,
            description: 'A list of comics (Comic Types) related to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "comics",
                    data: parent
                })
            }
        });
        t.list.field("characters", {
            type: "Character",
            nullable: true,
            description: 'A list of characters (Character Types) related to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "characters",
                    data: parent
                })
            }
        });
        t.list.field("creators", {
            type: "Creator",
            nullable: true,
            description: 'A list of creators (Creator Types) related to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "creators",
                    data: parent
                })
            }
        });
        t.field("next", {
            type: "Event",
            nullable: true,
            description: 'The next event (Event Type) in relation to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "next",
                    connectionType: "events",
                    cardinality: "one-one",
                    data: parent
                })
            }
        });
        t.field("previous", {
            type: "Event",
            nullable: true,
            description: 'The previous event (Event Type) in relation to this event',
            async resolve(parent: any, args, ctx) {
                return ctx.eventsModel.getConnection({
                    connectionName: "previous",
                    connectionType: "events",
                    cardinality: "one-one",
                    data: parent
                })
            }
        });
    }
});
export const EventsWhereInput = inputObjectType({
    name: "EventsWhereInput",
    description: 'Optional filters for events. See notes on individual inputs below.',
    definition(t) {
        t.string("name", { description: 'Return only events which match the specified name.' });
        t.string("nameStartsWith", { description: 'Return events with names that begin with the specified string (e.g. Sp).' });
        t.field("modifiedSince", {
            type: "DateTime",
            description: 'Return only events which have been modified since the specified date.',
        });
        t.list.id("creators", { description: 'Return only events which feature work by the specified creators (accepts a comma-separated list of ids).' });
        t.list.id("characters", { description: 'Return only events which feature the specified characters (accepts a comma-separated list of ids).' });
        t.list.id("series", { description: 'Return only events which are part of the specified series (accepts a comma-separated list of ids).' });
        t.list.id("comics", { description: 'Return only events which take place in the specified comics (accepts a comma-separated list of ids).' });
    }
});
export const EventsOrderBy = enumType({
    name: "EventsOrderBy",
    description: 'Order the result set by a field or fields. Multiple values are given priority in the order in which they are passed.',
    members: ['name_asc', 'startDate_asc', 'modified_asc', 'name_desc', 'startDate_desc', 'modified_desc'],
});
