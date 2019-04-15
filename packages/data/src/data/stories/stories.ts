// To parse this data:
//
//   import { Convert } from "./file";
//
//   const stories = Convert.toStories(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Stories {
    characters:    Characters;
    comics:        Characters;
    creators:      Creators;
    description:   number | string;
    events:        Characters;
    id:            number;
    modified:      string;
    originalIssue: OriginalIssue | null;
    resourceURI:   string;
    series:        Characters;
    thumbnail:     null;
    title:         number | string;
    type:          Type;
}

export interface Characters {
    available:     number;
    collectionURI: string;
    items:         OriginalIssue[];
    returned:      number;
}

export interface OriginalIssue {
    name:        string;
    resourceURI: string;
}

export interface Creators {
    available:     number;
    collectionURI: string;
    items:         Item[];
    returned:      number;
}

export interface Item {
    name:        string;
    resourceURI: string;
    role:        Role;
}

export enum Role {
    Artist = "artist",
    ArtistCover = "artist (cover)",
    AssistantEditor = "assistant editor",
    Colorist = "colorist",
    ColoristCover = "colorist (cover)",
    ConsultingEditor = "consulting editor",
    DigitalCoordinator = "digital coordinator",
    DigitalProductionManager = "digital production manager",
    DirectorOfDigitalContent = "director of digital content",
    Editor = "editor",
    EditorInChief = "editor in chief",
    Inker = "inker",
    InkerCover = "inker (cover)",
    Letterer = "letterer",
    LettererCover = "letterer (cover)",
    Other = "other",
    Painter = "painter",
    PainterCover = "painter (cover)",
    Penciler = "penciler",
    PencilerCover = "penciler (cover)",
    Penciller = "penciller",
    PencillerCover = "penciller (cover)",
    President = "president",
    Production = "production",
    ProjectManager = "project manager",
    Publisher = "publisher",
    RoleArtist = "Artist",
    RoleColorist = "Colorist",
    RoleInker = "Inker",
    RoleLetterer = "Letterer",
    RoleOther = "Other",
    RolePenciller = "Penciller",
    RolePencillerCover = "Penciller (cover)",
    RoleWriter = "Writer",
    SpecialSkrullyThanks = "special skrully thanks",
    Writer = "writer",
}

export enum Type {
    Activity = "activity",
    Ad = "ad",
    AdStory = "ad; story",
    AdditionalStoryInfo = "additional story info",
    Ads = "ads",
    AnimationInsert = "animation insert",
    Article = "article",
    BackCover = "back cover",
    Backcovers = "backcovers",
    Contents = "contents",
    ContentsPage = "contents page",
    Cover = "cover",
    CoverA = "cover a",
    CoverB = "cover b",
    CoverGallery = "cover gallery",
    CoverGatefold = "cover (gatefold)",
    CoverReprint = "cover reprint",
    Credits = "credits",
    Deadpool = "deadpool",
    Empty = "",
    Feature = "feature",
    Features = "features",
    Featurette = "featurette",
    Filler = "filler",
    Foreword = "foreword",
    Horror = "horror",
    Humor = "humor",
    IllustratedTextFeature = "illustrated text feature",
    Index = "index",
    Insert = "insert",
    Introduction = "introduction",
    Letters = "letters",
    MysteryStory = "mystery story",
    None = "none",
    PhotoStory = "photo story",
    PinUp = "pin-up",
    Pinup = "pinup",
    Portfolio = "portfolio",
    PosterInsert = "poster insert",
    Preview = "preview",
    Profile = "profile",
    Promo = "promo",
    PromoParody = "promo; parody",
    ReCap = "re-cap",
    Recap = "recap",
    StatementOfOwnership = "statement of ownership",
    Story = "story",
    StoryPSA = "story/psa",
    TableOfContents = "table of contents",
    Text = "text",
    TextArticle = "text article",
    TextFeature = "text feature",
    TextPage = "text page",
    TextStory = "text story",
    TradingCard = "trading card",
    TradingCardInsert = "trading card insert",
    VariousHeroes = "various heroes",
    WarStory = "war story",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toStories(json: string): { [key: string]: Stories } {
        return cast(JSON.parse(json), m(r("Stories")));
    }

    public static storiesToJson(value: { [key: string]: Stories }): string {
        return JSON.stringify(uncast(value, m(r("Stories"))), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(typ: any, val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(typ, val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Stories": o([
        { json: "characters", js: "characters", typ: r("Characters") },
        { json: "comics", js: "comics", typ: r("Characters") },
        { json: "creators", js: "creators", typ: r("Creators") },
        { json: "description", js: "description", typ: u(0, "") },
        { json: "events", js: "events", typ: r("Characters") },
        { json: "id", js: "id", typ: 0 },
        { json: "modified", js: "modified", typ: "" },
        { json: "originalIssue", js: "originalIssue", typ: u(r("OriginalIssue"), null) },
        { json: "resourceURI", js: "resourceURI", typ: "" },
        { json: "series", js: "series", typ: r("Characters") },
        { json: "thumbnail", js: "thumbnail", typ: null },
        { json: "title", js: "title", typ: u(0, "") },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Characters": o([
        { json: "available", js: "available", typ: 0 },
        { json: "collectionURI", js: "collectionURI", typ: "" },
        { json: "items", js: "items", typ: a(r("OriginalIssue")) },
        { json: "returned", js: "returned", typ: 0 },
    ], false),
    "OriginalIssue": o([
        { json: "name", js: "name", typ: "" },
        { json: "resourceURI", js: "resourceURI", typ: "" },
    ], false),
    "Creators": o([
        { json: "available", js: "available", typ: 0 },
        { json: "collectionURI", js: "collectionURI", typ: "" },
        { json: "items", js: "items", typ: a(r("Item")) },
        { json: "returned", js: "returned", typ: 0 },
    ], false),
    "Item": o([
        { json: "name", js: "name", typ: "" },
        { json: "resourceURI", js: "resourceURI", typ: "" },
        { json: "role", js: "role", typ: r("Role") },
    ], false),
    "Role": [
        "artist",
        "artist (cover)",
        "assistant editor",
        "colorist",
        "colorist (cover)",
        "consulting editor",
        "digital coordinator",
        "digital production manager",
        "director of digital content",
        "editor",
        "editor in chief",
        "inker",
        "inker (cover)",
        "letterer",
        "letterer (cover)",
        "other",
        "painter",
        "painter (cover)",
        "penciler",
        "penciler (cover)",
        "penciller",
        "penciller (cover)",
        "president",
        "production",
        "project manager",
        "publisher",
        "Artist",
        "Colorist",
        "Inker",
        "Letterer",
        "Other",
        "Penciller",
        "Penciller (cover)",
        "Writer",
        "special skrully thanks",
        "writer",
    ],
    "Type": [
        "activity",
        "ad",
        "ad; story",
        "additional story info",
        "ads",
        "animation insert",
        "article",
        "back cover",
        "backcovers",
        "contents",
        "contents page",
        "cover",
        "cover a",
        "cover b",
        "cover gallery",
        "cover (gatefold)",
        "cover reprint",
        "credits",
        "deadpool",
        "",
        "feature",
        "features",
        "featurette",
        "filler",
        "foreword",
        "horror",
        "humor",
        "illustrated text feature",
        "index",
        "insert",
        "introduction",
        "letters",
        "mystery story",
        "none",
        "photo story",
        "pin-up",
        "pinup",
        "portfolio",
        "poster insert",
        "preview",
        "profile",
        "promo",
        "promo; parody",
        "re-cap",
        "recap",
        "statement of ownership",
        "story",
        "story/psa",
        "table of contents",
        "text",
        "text article",
        "text feature",
        "text page",
        "text story",
        "trading card",
        "trading card insert",
        "various heroes",
        "war story",
    ],
};
