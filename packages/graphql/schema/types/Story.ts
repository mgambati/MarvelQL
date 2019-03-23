import { objectType, inputObjectType, enumType } from 'nexus';
export const Story = objectType({
    name: "Story",
    definition(t) {
        t.implements("MarvelNode");
        t.string("title", {
            nullable: true,
            description: 'The story title.',
        });
        t.string("description", {
            nullable: true,
            description: 'A short description of the story.',
        });
        t.string("type", {
            nullable: true,
            description: 'The story type e.g. interior story, cover, text story.',
        });
        t.list.field("comics", {
            type: "Comic",
            nullable: true,
            description: 'A list of comics (Comic Types) related to this story',
            async resolve(parent: any, args, ctx) {
                return ctx.storiesModel.getConnection({
                    connectionName: "comics",
                    data: parent
                })
            }
        });
        t.list.field("events", {
            type: "Event",
            nullable: true,
            description: 'A list of events (Event Types) related to this story',
            async resolve(parent: any, args, ctx) {
                return ctx.storiesModel.getConnection({
                    connectionName: "events",
                    data: parent
                })
            }
        });
        t.list.field("characters", {
            type: "Character",
            nullable: true,
            description: 'A list of characters (Character Types) related to this story',
            async resolve(parent: any, args, ctx) {
                return ctx.storiesModel.getConnection({
                    connectionName: "characters",
                    data: parent
                })
            }
        });
        t.list.field("creators", {
            type: "Creator",
            nullable: true,
            description: 'A list of creators (Creator Types) related to this story',
            async resolve(parent: any, args, ctx) {
                return ctx.storiesModel.getConnection({
                    connectionName: "creators",
                    data: parent
                })
            }
        });
        t.list.field("series", {
            type: "Series",
            nullable: true,
            description: 'A list of series (Series Types) related to this story',
            async resolve(parent: any, args, ctx) {
                return ctx.storiesModel.getConnection({
                    connectionName: "series",
                    data: parent
                })
            }
        });
        t.field("originalIssue", {
            type: "Summary",
            nullable: true,
            description: 'The original comic (Summary Type) with this story',
        });
    }
});
export const StoriesWhereInput = inputObjectType({
    name: "StoriesWhereInput",
    description: 'Optional filters for stories. See notes on individual inputs below.',
    definition(t) {
        t.field("modifiedSince", { type: "DateTime" });
        t.list.id("comics");
        t.list.id("series");
        t.list.id("events");
        t.list.id("creators");
        t.list.id("characters");
    }
});
export const StoriesOrderBy = enumType({
    name: "StoriesOrderBy",
    description: 'Order the result set by a field or fields. Multiple values are given priority in the order in which they are passed.',
    members: ['id_asc', 'id_desc', 'modified_asc', 'modified_desc'],
});