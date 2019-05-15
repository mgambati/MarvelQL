from graphene import ObjectType, String, Boolean, ID, List, Field, Int, InputObjectType, Argument, AbstractType, Date, Enum


class MarvelUrl(ObjectType):
    type = String()
    url = String()


class Summary(ObjectType):
    name = String()
    resourceURI = String()
    role = String()
    type = String()


class ComicDate(ObjectType):
    date = String()
    type = String()


class ComicImage(ObjectType):
    extension = String()
    path = String()


class ComicPrice(ObjectType):
    price = Int()
    type = String()


class TextObject(ObjectType):
    language = String()
    text = String()
    type = String()


class AllList(ObjectType):
    available = Int()
    returned = Int()
    collectionURI = String()
    items = List(Summary)


class Image(ObjectType):
    path = String()
    extension = String()


class Comic(ObjectType):
    id = ID()
    digitalId = Int()
    title = String()
    issueNumber = Int()
    variantDescription = String()
    description = String()
    modified = String()
    isbn = String()
    upc = String()
    diamondCode = String()
    ean = String()
    issn = String()
    format = String()
    pageCount = Int()
    textObjects = List(TextObject)
    resourceURI = String()
    urls = List(MarvelUrl)
    series = Field(Summary)
    variants = List(Summary)
    collections = List(Summary)
    collectedIssues = List(Summary)
    dates = List(ComicDate)
    prices = List(ComicPrice)
    thumbnail = String()
    images = List(ComicImage)
    creators = Field(AllList)
    characters = Field(AllList)
    stories = Field(AllList)
    events = Field(AllList)


class Character(ObjectType):
    id = ID()
    name = String()
    description = String()
    resourceURI = String()
    thumbnail = String()
    comics = Field(AllList)
    events = Field(AllList)
    series = Field(AllList)
    stories = Field(AllList)
    urls = List(MarvelUrl)
    has_profile_pic = Boolean()
    id = ID()
    picture_url = String()
    smart_name = String()
    thumbnail_url = String()
    modified = Date()


class Creator(ObjectType):
    id = ID()
    firstName = String()
    middleName = String()
    lastName = String()
    suffix = String()
    fullName = String()
    resourceURI = String()
    urls = List(MarvelUrl)
    thumbnail = Field(Image)
    series = Field(AllList)
    stories = Field(AllList)
    comics = Field(AllList)
    events = Field(AllList)


class Event(ObjectType):
    id = ID()
    title = String()
    description = String()
    resourceURI = String()
    urls = List(MarvelUrl)
    start = Date()
    end = Date()
    thumbnail = Field(Image)
    comics = Field(AllList)
    stories = Field(AllList)
    series = Field(AllList)
    characters = Field(AllList)
    creators = Field(AllList)
    next = Field(Summary)
    previous = Field(Summary)


class Series(ObjectType):
    id = ID()
    title = String()
    description = String()
    resourceURI = String()
    urls = List(MarvelUrl)
    startYear = Int()
    endYear = Int()
    rating = String()
    modified = Date()
    thumbnail = Field(Image)
    comics = Field(AllList)
    stories = Field(AllList)
    events = Field(AllList)
    characters = Field(AllList)
    creators = Field(AllList)
    next = Field(Summary)
    previous = Field(Summary)


class Story(ObjectType):
    id = ID()
    title = String()
    description = String()
    resourceURI = String()
    type = String()
    modified = Date()
    thumbnail = Field(Image)
    comics = Field(AllList)
    series = Field(AllList)
    events = Field(AllList)
    characters = Field(AllList)
    creators = Field(AllList)
    originalissue = Field(Summary)


class Format(Enum):
    COMIC = "comic"
    MAGAZINE = "magazine"
    TRADE_PAPERBACK = "trade paperback"
    HARDCOVER = "hardcover"
    DIGEST = "digest"
    GRAPHIC_NOVEL = "graphic novel"
    DIGITAL_COMIC = "digital comic"
    INFINITE_COMIC = "infinite comic"


class FormatType(Enum):
    COMIC = 'comic'
    COLLECTION = 'collection'


class SeriesType(Enum):
    COLLECTION = "collection"
    ONESHOT = "one shot"
    LIMITED = "limited"
    ONGOING = "ongoing"


class CharacterOrderBy(Enum):
    NAME = "name"
    MODIFIED = "modified"
    DESCENDINGNAME = "-name"
    DESCENDINGMODIFIED = "-modified"


class ComicOrderBy(Enum):
    FOCDATE = "focDate"
    ONSALEDATE = "onsaleDate"
    TITLE = "title"
    ISSUENUMBER = "issueNumber"


class CreatorOrderBy(Enum):
    LASTNAME = "lastName"
    FIRSTNAME = 'firstName'
    MIDDLENAME = "middleName"
    SUFFIX = "suffix"


class EventOrderBy(Enum):
    NAME = "name"
    STARTDATE = "startDate"
    MODIFIED = "modified"
    DESCENDINGNAME = "-name"


class SeriesOrderBy(Enum):
    TITLE = "title"
    MODIFIED = "modified"
    STARTYEAR = "startYear"
    DESCENDINGTITLE = "-title"


class StoryOrderBy(Enum):
    ID = "id"
    MODIFIED = "modified"
    DESCENDINGID = "-id"
    DESCENDINGMODIFIED = "-modified"
